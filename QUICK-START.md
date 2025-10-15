# 🚀 Quick Start: Deploy to Google Cloud Run

This is a streamlined guide to get your portfolio live on khalilpreview.space in under 30 minutes.

## Prerequisites (5 minutes)

1. **Google Cloud Account**: [Sign up](https://console.cloud.google.com)
2. **gcloud CLI**: [Install](https://cloud.google.com/sdk/docs/install)
3. **MongoDB Atlas Account**: [Sign up free](https://www.mongodb.com/cloud/atlas/register)
4. **GitHub Account**: [Sign up](https://github.com/join)

## Step 1: Set Up MongoDB Atlas (5 minutes)

1. Create a free cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create database user:
   - Username: `portfolio_user`
   - Password: Generate strong password
3. Network Access: Add `0.0.0.0/0` (allow from anywhere)
4. Get connection string: `mongodb+srv://portfolio_user:PASSWORD@cluster.mongodb.net/portfolio_db`

## Step 2: Set Up Google Cloud (10 minutes)

```bash
# Login to Google Cloud
gcloud auth login

# Create new project
gcloud projects create ibrahim-portfolio-$(date +%s) --name="Ibrahim Portfolio"

# Set as default (replace with your project ID)
export PROJECT_ID="ibrahim-portfolio-XXXXX"
gcloud config set project $PROJECT_ID

# Link billing (required - but free tier available)
gcloud billing accounts list
gcloud billing projects link $PROJECT_ID --billing-account=YOUR_BILLING_ACCOUNT

# Enable APIs (this may take 2-3 minutes)
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  containerregistry.googleapis.com
```

## Step 3: Get Your API Keys (3 minutes)

### Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key (starts with `AIza...`)

## Step 4: Deploy with One Command (10 minutes)

```bash
# Clone the repository (if not already)
git clone https://github.com/ZYNIQ-AI-Driven-Development-Firm/Ibrahim-El-Khalil-Portfolio-new-version.git
cd Ibrahim-El-Khalil-Portfolio-new-version

# Run deployment script
./deploy.sh
# or on Windows: deploy.bat

# When prompted, enter:
# - Project ID: ibrahim-portfolio-XXXXX
# - Region: us-central1
# - MongoDB URL: mongodb+srv://...
# - Gemini API Key: AIza...
```

The script will:
- ✅ Build Docker images
- ✅ Push to Google Container Registry
- ✅ Deploy backend and frontend
- ✅ Configure environment variables
- ✅ Show you the live URLs

## Step 5: Configure Auto-Deployment (5 minutes)

### Create Service Account

```bash
# Create service account for GitHub Actions
gcloud iam service-accounts create github-actions-sa

# Grant permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions-sa@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions-sa@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions-sa@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Create and download key
gcloud iam service-accounts keys create gcloud-key.json \
  --iam-account=github-actions-sa@$PROJECT_ID.iam.gserviceaccount.com

# Copy this for GitHub Secrets
cat gcloud-key.json | base64 -w 0  # Linux/Mac
# or
certutil -encode gcloud-key.json gcloud-key-base64.txt  # Windows
```

### Add GitHub Secrets

Go to: Your Repo → Settings → Secrets and variables → Actions

Add these 4 secrets:

| Secret Name | Value |
|-------------|-------|
| GCP_PROJECT_ID | `ibrahim-portfolio-XXXXX` |
| GCP_SA_KEY | `<base64-encoded-key-from-above>` |
| GEMINI_API_KEY | `AIza...` |
| MONGO_URL | `mongodb+srv://...` |

### Test Auto-Deployment

```bash
# Make a small change
echo "# Test auto-deploy" >> README.md

# Commit and push
git add .
git commit -m "test: Verify auto-deployment"
git push origin main

# Watch deployment at:
# https://github.com/your-username/your-repo/actions
```

## Step 6: Connect Your Domain (5 minutes)

### Verify Domain Ownership

```bash
# Start verification
gcloud domains verify khalilpreview.space

# You'll get a TXT record like:
# google-site-verification=XXXXXXXXXXXXX
```

Add this TXT record to your domain DNS settings.

### Map Domain to Cloud Run

```bash
# After verification is complete
gcloud run domain-mappings create \
  --service portfolio-frontend \
  --domain khalilpreview.space \
  --region us-central1

# You'll get DNS records to add
```

### Update DNS Records

At your domain registrar (e.g., GoDaddy, Namecheap), add:

**A Record:**
- Type: `A`
- Name: `@`
- Value: `<IP from Cloud Run>`

**CNAME Record (www):**
- Type: `CNAME`
- Name: `www`
- Value: `ghs.googlehosted.com`

**Wait 15-30 minutes for DNS propagation.**

## Step 7: Migrate Data (2 minutes)

```bash
# After deployment, migrate your portfolio data
python migrate_data.py

# Or use the API directly
curl -X POST https://khalilpreview.space/api/migrate \
  -H "Content-Type: application/json" \
  -d @migrate_data.json
```

## Step 8: Verify Everything Works ✅

```bash
# Check backend health
curl https://khalilpreview.space/api/health

# Check frontend
curl -I https://khalilpreview.space

# Open in browser
open https://khalilpreview.space  # Mac
start https://khalilpreview.space  # Windows
```

### Test Checklist:
- [ ] Homepage loads
- [ ] Business card displays
- [ ] All sections load data
- [ ] AI chat responds
- [ ] Theme customization works
- [ ] Admin dashboard accessible
- [ ] Mobile layout correct
- [ ] HTTPS working (green lock)

## 🎉 You're Live!

Your portfolio is now:
- ✅ Deployed on Google Cloud Run
- ✅ Accessible at https://khalilpreview.space
- ✅ Auto-deploys on every push to main
- ✅ Secured with HTTPS
- ✅ Globally distributed via Google's CDN

## Costs

**Expected Monthly Costs:**
- Cloud Run: $0-10 (free tier covers most traffic)
- MongoDB Atlas: $0 (free tier)
- Domain: $10-15/year (one-time)

**Total: ~$0-10/month** for most portfolios

## Troubleshooting

### Build Fails
```bash
# Check build logs
gcloud builds list --limit=5
gcloud builds log <BUILD_ID>
```

### Site Not Loading
```bash
# Check service status
gcloud run services list

# View logs
gcloud run logs read portfolio-frontend --limit=50
```

### Domain Not Working
```bash
# Verify DNS
nslookup khalilpreview.space
dig khalilpreview.space

# Check domain mapping
gcloud run domain-mappings describe khalilpreview.space \
  --service portfolio-frontend \
  --region us-central1
```

## Next Steps

1. **Customize Content**: Update your profile, experience, and projects in the admin dashboard
2. **Monitor Performance**: Set up Cloud Monitoring alerts
3. **Optimize Images**: Use WebP format for better performance
4. **Add Analytics**: Integrate Google Analytics 4
5. **Set Up Backups**: Configure automated database backups

## Useful Commands

```bash
# View all services
gcloud run services list

# Describe a service
gcloud run services describe portfolio-frontend --region us-central1

# Update service
gcloud run services update portfolio-frontend --memory 512Mi

# View logs
gcloud run logs read portfolio-frontend --limit 100 --format json

# Delete a service (careful!)
gcloud run services delete portfolio-frontend --region us-central1
```

## Support

- **Documentation**: See [CLOUD-RUN-DEPLOYMENT.md](./CLOUD-RUN-DEPLOYMENT.md) for detailed guide
- **Checklist**: See [DEPLOYMENT-CHECKLIST.md](./DEPLOYMENT-CHECKLIST.md) for complete checklist
- **Issues**: Open an issue on GitHub

---

**Need Help?** 
- Cloud Run Docs: https://cloud.google.com/run/docs
- GitHub Actions: https://docs.github.com/en/actions
- MongoDB Atlas: https://docs.atlas.mongodb.com

**Congratulations on your deployment! 🚀**
