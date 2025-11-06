# Comment lister les produits CJ Dropshipping selon la documentation

Référence: [Documentation officielle CJ Dropshipping - Product List V2](https://developers.cjdropshipping.cn/en/api/api2/api/product.html#_1-products)

## 📋 Endpoint API

### Product List V2 (GET) - Recommandé

**URL:** `https://developers.cjdropshipping.com/api2.0/v1/product/listV2`

**Méthode:** GET

**Headers requis:**
```
CJ-Access-Token: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 🔍 Paramètres de recherche

### Paramètres disponibles

| Paramètre       | Type    | Requis | Description                                    | Valeurs                      |
|----------------|---------|--------|------------------------------------------------|------------------------------|
| `keyWord`      | string  | N      | Mot-clé de recherche (nom produit ou SKU)     | "Gua Sha", "K-Beauty", etc. |
| `page`         | int     | N      | Numéro de page                                 | Min: 1, Max: 1000, Def: 1   |
| `size`         | int     | N      | Nombre de résultats par page                   | Min: 1, Max: 100, Def: 10   |
| `categoryId`   | string  | N      | ID de catégorie (3ème niveau)                 | Ex: "2252588B-72E3-..."     |
| `countryCode`  | string  | N      | Code pays (filtre inventaire)                  | "CN", "US", "FR", etc.      |
| `startSellPrice` | decimal | N   | Prix de vente minimum                         |                              |
| `endSellPrice` | decimal | N     | Prix de vente maximum                         |                              |

### Paramètres supplémentaires (non implémentés actuellement)

- `lv2categoryList` - Array de catégories niveau 2
- `lv3categoryList` - Array de catégories niveau 3
- `sortField` - Champ de tri (price, inventory, etc.)
- `sortType` - Type de tri (asc, desc)

## 📝 Exemples d'utilisation

### Exemple 1 : Recherche simple par mot-clé

```bash
curl --location --request GET 'https://developers.cjdropshipping.com/api2.0/v1/product/listV2?page=1&size=20&keyWord=Gua%20Sha' \
  --header 'CJ-Access-Token: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
```

### Exemple 2 : Recherche avec filtre de prix

```bash
curl --location --request GET 'https://developers.cjdropshipping.com/api2.0/v1/product/listV2?page=1&size=20&keyWord=K-Beauty&startSellPrice=10&endSellPrice=50' \
  --header 'CJ-Access-Token: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
```

### Exemple 3 : Recherche par catégorie

```bash
curl --location --request GET 'https://developers.cjdropshipping.com/api2.0/v1/product/listV2?page=1&size=20&categoryId=2252588B-72E3-4397-8C92-7D9967161084' \
  --header 'CJ-Access-Token: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
```

## 📦 Réponse API

### Structure de réponse (succès)

```json
{
  "code": 200,
  "result": true,
  "message": "Success",
  "data": {
    "pageNum": 1,
    "pageSize": 20,
    "total": 1500,
    "list": [
      {
        "id": "1534092419615174656",
        "pid": "1534092419615174656",
        "productNameEn": "Gua Sha Rose Quartz",
        "productSku": "GUA-SHA-001",
        "productImage": "https://...",
        "productImageList": ["https://...", "https://..."],
        "sellPrice": 12.99,
        "categoryId": "2252588B-72E3-4397-8C92-7D9967161084",
        "categoryName": "Beauty & Personal Care",
        "warehouseInventoryNum": 5000,
        "variants": [
          {
            "vid": "1534092419615174657",
            "variantNameEn": "Rose Quartz",
            "variantSku": "GUA-SHA-001-RQ",
            "variantSellPrice": 12.99,
            "variantInventory": 5000
          }
        ]
      }
    ]
  },
  "requestId": "bcde45ac-da31-4fc7-a05e-e3b23a1e6694"
}
```

### Structure de réponse (erreur)

```json
{
  "code": 1600100,
  "result": false,
  "message": "Param error",
  "data": null,
  "requestId": "323fda9d-3c94-41dc-a944-5cc1b8baf5b1"
}
```

## 🔧 Implémentation dans le projet

### Code actuel (Supabase Edge Functions)

Le code utilise déjà l'endpoint `listV2` correctement :

```typescript
// supabase/functions/_shared/cj-api/client.ts
export async function getProductList(params: {
  keyWord?: string;
  categoryId?: string;
  page?: number;
  pageSize?: number;  // Mappé vers 'size' dans l'API
  startSellPrice?: number;
  endSellPrice?: number;
  countryCode?: string;
}): Promise<CJProductListResponse['data']> {
  const queryParams = new URLSearchParams();

  if (params.keyWord) queryParams.append('keyWord', params.keyWord);
  if (params.categoryId) queryParams.append('categoryId', params.categoryId);
  if (params.page) queryParams.append('page', String(params.page));
  if (params.pageSize) queryParams.append('size', String(params.pageSize));
  if (params.startSellPrice) queryParams.append('startSellPrice', String(params.startSellPrice));
  if (params.endSellPrice) queryParams.append('endSellPrice', String(params.endSellPrice));
  if (params.countryCode) queryParams.append('countryCode', params.countryCode);

  const endpoint = `/product/listV2?${queryParams.toString()}`;
  const response = await cjApiCall<CJProductListResponse['data']>(endpoint, { method: 'GET' });

  return response.data;
}
```

### Utilisation via l'UI Admin

1. **Via l'interface admin :**
   - Aller sur `/admin/cj/products`
   - Entrer un mot-clé (ex: "Gua Sha")
   - Cliquer sur "Synchroniser"
   - Les produits seront récupérés et sauvegardés dans Supabase

2. **Via l'API Next.js :**
   ```bash
   POST /api/admin/cj/sync-products
   {
     "keyWord": "Gua Sha",
     "pageSize": 20,
     "maxPages": 5
   }
   ```

3. **Via Supabase Edge Function :**
   ```bash
   POST https://ton-projet.supabase.co/functions/v1/sync-cj-products
   {
     "keyWord": "Gua Sha",
     "pageSize": 20,
     "maxPages": 5
   }
   ```

## ⚙️ Paramètres importants

### Limites de pagination

- **`page`** : Minimum 1, Maximum 1000
- **`size`** : Minimum 1, Maximum 100
- **Par défaut** : `page=1`, `size=10`

### Performance

- L'endpoint `listV2` utilise **Elasticsearch** pour une recherche rapide
- Support de la recherche par mot-clé dans le nom et SKU
- Support de plusieurs filtres simultanés

### Notes importantes

1. **Token d'accès** : Le token CJ doit être obtenu via OAuth2 (`/api/oauth/token`)
2. **Cache** : Le token est mis en cache pour éviter les appels répétés
3. **Rate limiting** : Respecter les limites de l'API CJ (généralement 1 token request / 5 min)
4. **Pagination** : Pour récupérer tous les produits, il faut itérer sur plusieurs pages

## 🔄 Workflow complet

1. **Obtenir le token d'accès** (automatique via `getCjAccessToken()`)
2. **Appeler l'API** avec les paramètres de recherche
3. **Traiter les résultats** (sauvegarder dans Supabase si nécessaire)
4. **Pagination** : Répéter pour les pages suivantes si besoin

## 📚 Références

- [Documentation officielle CJ Dropshipping](https://developers.cjdropshipping.cn/en/api/api2/api/product.html#_1-products)
- Code source : `supabase/functions/_shared/cj-api/client.ts`
- Edge Function : `supabase/functions/sync-cj-products/index.ts`

