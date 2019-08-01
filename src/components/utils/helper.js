import fs from 'fs'

export const readLocalFile = path => {
  return new Promise((resolve, reject) => {
    fs.readFile('src/components/data/base.java', 'utf-8', (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}
