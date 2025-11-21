# Migration : Ajout du support Tarank'i Levy

## 🔧 Étapes de migration

### Option 1 : Via PowerShell (Recommandé)

```powershell
cd D:\Samuel\PROJET\BdPasteur\Presence_QR_code\backend
Get-Content database/migrate_add_taranki_levy.sql | mysql -u root -p presence_pasteurs
```

Entrez votre mot de passe MySQL quand demandé.

### Option 2 : Via Laragon Terminal

1. Ouvrez le terminal Laragon
2. Exécutez :

```bash
cd /d/Samuel/PROJET/BdPasteur/Presence_QR_code/backend
mysql -u root -p presence_pasteurs < database/migrate_add_taranki_levy.sql
```

### Option 3 : Via phpMyAdmin

1. Ouvrez phpMyAdmin (http://localhost/phpmyadmin)
2. Sélectionnez la base `presence_pasteurs`
3. Cliquez sur l'onglet "SQL"
4. Copiez-collez le contenu du fichier `database/migrate_add_taranki_levy.sql`
5. Cliquez sur "Exécuter"

## ✅ Vérification

Après la migration, vous devriez voir :
- ✅ Colonne `taranki_levy_id` ajoutée
- ✅ Colonne `type_personne` ajoutée
- ✅ Index créés
- ✅ Clé étrangère ajoutée

## 🚀 Après la migration

1. Redémarrez le serveur backend (`npm run dev`)
2. Testez le scan avec un matricule de Tarank'i Levy (4xxx)
3. Tout devrait fonctionner ! 🎉

## ⚠️ En cas d'erreur

Si vous voyez une erreur "Duplicate column name", c'est que la colonne existe déjà. 
Dans ce cas, ignorez l'erreur et vérifiez que les données sont correctes.

