#!/usr/bin/env node

/**
 * Script para limpar a pasta .next de forma segura
 * Resolve problemas com OneDrive sincronizando arquivos de cache
 */

const fs = require('fs');
const path = require('path');

const nextDir = path.join(process.cwd(), '.next');

function removeDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return;
  }

  try {
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        removeDir(filePath);
      } else {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          // Ignora erros de arquivos bloqueados (OneDrive)
          if (err.code !== 'EBUSY' && err.code !== 'EPERM') {
            console.warn(`Aviso: Não foi possível remover ${filePath}:`, err.message);
          }
        }
      }
    }
    
    try {
      fs.rmdirSync(dirPath);
    } catch (err) {
      if (err.code !== 'EBUSY' && err.code !== 'EPERM') {
        console.warn(`Aviso: Não foi possível remover diretório ${dirPath}:`, err.message);
      }
    }
  } catch (err) {
    console.error(`Erro ao limpar ${dirPath}:`, err.message);
  }
}

if (fs.existsSync(nextDir)) {
  console.log('Limpando pasta .next...');
  removeDir(nextDir);
  console.log('Pasta .next limpa!');
} else {
  console.log('Pasta .next não existe.');
}

