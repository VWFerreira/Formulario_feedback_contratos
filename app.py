from flask import Flask, render_template, request
import pandas as pd
import os

app = Flask(__name__)

# Carrega a planilha e evita valores nulos
df_contratos = pd.read_excel("CONTRATOS .xlsx").fillna("")

@app.route("/", methods=["GET", "POST"])
def index():
    contratos = df_contratos["CONTRATO"].unique()
    dados = {}
    imagens = []

    if request.method == "POST":
        form = request.form.to_dict()
        imagens = request.files.getlist("IMAGENS")
        # As imagens serão exibidas com JavaScript no HTML, não manipuladas no backend

    contrato_selecionado = request.args.get("contrato")
    if contrato_selecionado:
        linha = df_contratos[df_contratos["CONTRATO"] == contrato_selecionado]
        if not linha.empty:
            dados = linha.iloc[0].to_dict()

            if "PRAZO FINAL CONTRATUAL" in dados:
                try:
                    data = pd.to_datetime(dados["PRAZO FINAL CONTRATUAL"])
                    dados["PRAZO FINAL CONTRATUAL"] = data.strftime("%Y-%m-%d")
                except:
                    pass

            campos_moeda = [
                "VALOR DO CONTRATO",
                "VALOR ADITIVO",
                "VALOR CONTRATO + ADITIVOS",
                "VALOR CONSUMIDO",
                "SALDO DO CONTRATO"
            ]

            for campo in campos_moeda:
                if campo in dados:
                    try:
                        valor = float(dados[campo])
                        dados[campo] = f"R$ {valor:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
                    except:
                        pass

    return render_template("index.html", contratos=contratos, dados=dados)

if __name__ == "__main__":
    app.run(debug=True)