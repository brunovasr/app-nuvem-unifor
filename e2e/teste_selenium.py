"""Teste de interface (Selenium WebDriver) do sistema de biblioteca.

Fluxo: login como bibliotecário -> acervo -> emprestar livro -> aba de empréstimos.

Pré-requisitos: Python 3, `pip install selenium` e Google Chrome instalado
(o Selenium 4 baixa o driver compatível sozinho).

Uso (com o servidor rodando: SEED_SENHA=Demo@1234 npm start):
    python e2e/teste_selenium.py [URL_BASE]

Os prints de cada etapa são salvos em docs/ambientes/selenium/.
"""
import os
import sys
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000"
SENHA = os.environ.get("SEED_SENHA", "Demo@1234")
PASTA = Path(__file__).resolve().parent.parent / "docs" / "ambientes" / "selenium"
PASTA.mkdir(parents=True, exist_ok=True)

opcoes = webdriver.ChromeOptions()
opcoes.add_argument("--window-size=1100,800")
if os.environ.get("SEM_JANELA"):
    opcoes.add_argument("--headless=new")
nav = webdriver.Chrome(options=opcoes)
espera = WebDriverWait(nav, 15)


def print_tela(nome):
    nav.save_screenshot(str(PASTA / f"{nome}.png"))
    print(f"[print] {nome}.png")


try:
    nav.get(URL)
    espera.until(EC.presence_of_element_located((By.TAG_NAME, "h1")))
    assert nav.find_element(By.TAG_NAME, "h1").text == "Acesse sua conta"
    print("[ok] tela de login carregada")
    print_tela("01-login")

    nav.find_element(By.CSS_SELECTOR, "input[type=email]").send_keys("bibliotecario@unifor.br")
    nav.find_element(By.CSS_SELECTOR, "input[type=password]").send_keys(SENHA)
    nav.find_element(By.CSS_SELECTOR, "form button").click()
    espera.until(EC.text_to_be_present_in_element((By.TAG_NAME, "h1"), "Biblioteca UNIFOR"))
    espera.until(EC.presence_of_element_located((By.XPATH, "//h2[text()='Acervo']")))
    espera.until(EC.presence_of_element_located((By.XPATH, "//*[contains(text(),'Dom Casmurro')]")))
    print("[ok] login do bibliotecário e acervo exibido")
    print_tela("02-acervo")

    botao = espera.until(EC.element_to_be_clickable(
        (By.XPATH, "//*[contains(text(),'Dom Casmurro')]/ancestor::*[.//button[text()='Emprestar']][1]//button[text()='Emprestar']")))
    botao.click()
    print("[ok] empréstimo de 'Dom Casmurro' solicitado")
    print_tela("03-emprestimo-realizado")

    espera.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Empréstimos')]"))).click()
    espera.until(EC.presence_of_element_located((By.XPATH, "//*[contains(text(),'Dom Casmurro')]")))
    print("[ok] aba de empréstimos lista o livro emprestado")
    print_tela("04-emprestimos")
    print("RESULTADO: teste de interface concluído com sucesso")
finally:
    nav.quit()
