let relatorioIndex = 1;

function autoResizeTextareas(context = document) {
    context.querySelectorAll('textarea').forEach(textarea => {
        textarea.addEventListener('input', function () {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });

        textarea.style.height = textarea.scrollHeight + 'px';
        textarea.style.overflowY = 'hidden';
    });
}

function adicionarCampoImagem(botao) {
    const container = botao.parentElement.querySelector('.imagens-container');
    const input = document.createElement('input');
    input.type = 'file';
    input.name = 'IMAGENS';
    input.className = 'form-control mb-2';
    input.onchange = function () { previewImage(this); };
    container.appendChild(input);
}

function previewImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const wrapper = document.createElement('div');
            wrapper.className = 'image-wrapper mb-3';

            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'preview-image w-100';

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn btn-danger btn-sm mt-2';
            btn.innerText = 'Remover imagem';
            btn.onclick = () => wrapper.remove();

            wrapper.appendChild(img);
            wrapper.appendChild(btn);

            const previewArea = input.closest('form.relatorio').querySelector('.preview-area');
            previewArea.appendChild(wrapper);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function adicionarRelatorio() {
    const wrapper = document.getElementById('relatorios-wrapper');
    const original = wrapper.querySelector('form.relatorio');
    const clone = original.cloneNode(true);

    relatorioIndex++;

    // limpa campos
    clone.querySelectorAll('input, textarea, select').forEach(el => {
        if (el.type !== 'file') el.value = '';
    });

    // limpa imagens
    const preview = clone.querySelector('.preview-area');
    if (preview) preview.innerHTML = '';

    // Atualiza IDs únicos para toggle
    const valoresSection = clone.querySelector('[id^="valores-section"]');
    const toggleIcon = clone.querySelector('[id^="toggle-icon"]');
    const toggleTitle = clone.querySelector('.section-title[onclick]');

    if (valoresSection) {
        valoresSection.id = `valores-section-${relatorioIndex}`;
    }

    if (toggleIcon) {
        toggleIcon.id = `toggle-icon-${relatorioIndex}`;
    }

    if (toggleTitle) {
        toggleTitle.setAttribute('onclick', `toggleValores(${relatorioIndex})`);
    }

    // reconecta onchange imagem
    clone.querySelectorAll('input[type="file"]').forEach(input => {
        input.onchange = function () { previewImage(this); };
    });

    wrapper.appendChild(clone);
    setTimeout(() => autoResizeTextareas(clone), 50);
}

function toggleValores(index = 1) {
    const valores = document.getElementById(`valores-section-${index}`);
    const icon = document.getElementById(`toggle-icon-${index}`);

    if (!valores || !icon) return;

    if (valores.classList.contains('oculto')) {
        valores.classList.remove('oculto');
        icon.innerText = '[-]';
    } else {
        valores.classList.add('oculto');
        icon.innerText = '[+]';
    }
}

window.addEventListener('DOMContentLoaded', () => {
    autoResizeTextareas();

    document.querySelectorAll('textarea').forEach(textarea => {
        textarea.setAttribute("style", "height:" + (textarea.scrollHeight) + "px;overflow-y:hidden;");
        textarea.addEventListener("input", function () {
            this.style.height = "auto";
            this.style.height = (this.scrollHeight) + "px";
        });
    });
});

window.addEventListener('beforeprint', () => {
    document.querySelectorAll('.preview-image').forEach(img => {
        const offsetTop = img.getBoundingClientRect().top;
        const spaceLeft = window.innerHeight - offsetTop - 60;
        img.style.maxHeight = spaceLeft + 'px';
    });
});
