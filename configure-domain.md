# Custom Domain Configuration for khalilpreview.space

## Prerequisites
You need to have Google Cloud SDK installed and authenticated. If not installed, follow:
https://cloud.google.com/sdk/docs/install

## Domain Configuration Steps

### Step 1: Verify Domain Ownership
```bash
gcloud domains verify khalilpreview.space
```
This will provide a TXT record that you need to add to your DNS settings.

### Step 2: Map Domain to Frontend Service
```bash
gcloud run domain-mappings create \
  --service portfolio-frontend \
  --domain khalilpreview.space \
  --region us-central1
```

### Step 3: Map API Subdomain to Backend Service (Optional)
```bash
gcloud run domain-mappings create \
  --service portfolio-backend \
  --domain api.khalilpreview.space \
  --region us-central1
```

### Step 4: Check Domain Mapping Status
```bash
gcloud run domain-mappings list --region us-central1
```

### Step 5: Update DNS Records at Domain Registrar
After running the domain mapping commands, Google will provide DNS records:

**For khalilpreview.space:**
- Type: `A`
- Name: `@` 
- Value: `<IP provided by Google>`

**For www.khalilpreview.space:**
- Type: `CNAME`
- Name: `www`
- Value: `ghs.googlehosted.com`

**For api.khalilpreview.space (if mapping backend):**  
- Type: `CNAME`
- Name: `api`
- Value: `ghs.googlehosted.com`

## Alternative: Manual Configuration via Google Cloud Console

1. Go to Google Cloud Console > Cloud Run
2. Select your frontend service: `portfolio-frontend`
3. Click on "Manage Custom Domains" 
4. Add domain: `khalilpreview.space`
5. Follow the verification process
6. Update DNS records as provided

## Current Service URLs
- Frontend: https://portfolio-frontend-71372052711.us-central1.run.app/
- Backend: https://portfolio-backend-71372052711.us-central1.run.app/

## Next Steps After Domain Configuration
1. Update CORS settings in backend to include the new domain
2. Update frontend environment variables if needed
3. Test SSL certificate provisioning (automatic with Cloud Run)
4. Verify all functionality works with custom domain