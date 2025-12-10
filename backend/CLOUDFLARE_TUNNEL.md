# Cloudflare Tunnel Setup for Raspberry Pi

## Why Cloudflare Tunnel?

- ✅ **Free forever** (no paid tier)
- ✅ **Permanent URL** (`campus-bot.your-domain.com`)
- ✅ **Automatic HTTPS**
- ✅ **No port forwarding** required
- ✅ **DDoS protection** included
- ✅ **Auto-restarts** on Pi reboot

**Better than ngrok** because the URL never changes and it's free.

---

## Setup Steps

### 1. Install Cloudflared on Raspberry Pi

```bash
# Download ARM64 version
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64
sudo mv cloudflared-linux-arm64 /usr/local/bin/cloudflared
sudo chmod +x /usr/local/bin/cloudflared

# Verify installation
cloudflared --version
```

### 2. Login to Cloudflare

```bash
cloudflared tunnel login
```

This opens a browser. Login to Cloudflare and authorize the device.

### 3. Create a Tunnel

```bash
# Create tunnel named "campus-robot"
cloudflared tunnel create campus-robot

# Note the Tunnel ID from output
```

Save the tunnel ID (looks like: `abc123-def456-ghi789`)

### 4. Configure the Tunnel

Create config file:

```bash
mkdir -p ~/.cloudflared
nano ~/.cloudflared/config.yml
```

Add this configuration:

```yaml
tunnel: abc123-def456-ghi789 # Replace with your tunnel ID
credentials-file: /home/pi/.cloudflared/abc123-def456-ghi789.json

ingress:
  - hostname: campus-bot.yourdomain.com # Replace with your domain
    service: http://localhost:5000
  - service: http_status:404
```

> [!IMPORTANT]
> You need a domain name. If you don't have one, Cloudflare provides a free `*.trycloudflare.com` subdomain.

**For free subdomain** (no custom domain needed):

```yaml
tunnel: abc123-def456-ghi789
credentials-file: /home/pi/.cloudflared/abc123-def456-ghi789.json

ingress:
  - service: http://localhost:5000
```

### 5. Route DNS

**Option A: With custom domain**

```bash
cloudflared tunnel route dns campus-robot campus-bot.yourdomain.com
```

**Option B: Without custom domain (free)**

Start tunnel without DNS config - you'll get a `*.trycloudflare.com` URL.

### 6. Start the Tunnel

```bash
# Test run
cloudflared tunnel run campus-robot
```

If using free subdomain, you'll see:

```
Your quick Tunnel: https://random-words-1234.trycloudflare.com
```

**Copy this URL!** This is your permanent backend URL.

### 7. Run as Service (Auto-start on boot)

```bash
# Install as system service
sudo cloudflared service install

# Start service
sudo systemctl start cloudflared
sudo systemctl enable cloudflared

# Check status
sudo systemctl status cloudflared
```

---

## Update Frontend

Edit `.env.local`:

```env
# With custom domain
VITE_BACKEND_URL=https://campus-bot.yourdomain.com

# OR with free Cloudflare subdomain
VITE_BACKEND_URL=https://random-words-1234.trycloudflare.com
```

---

## Update Backend CORS

Edit `backend/app.py`:

```python
CORS(app, origins=[
    "http://localhost:5173",
    "https://campus-navigator.vercel.app",
    "https://campus-navigator-*.vercel.app"
])
```

Restart backend:

```bash
sudo systemctl restart backend  # If running as service
# OR
python3 app.py
```

---

## Complete Setup Script

```bash
#!/bin/bash
# One-command Cloudflare Tunnel setup

# Install cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64
sudo mv cloudflared-linux-arm64 /usr/local/bin/cloudflared
sudo chmod +x /usr/local/bin/cloudflared

# Login (opens browser)
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create campus-robot

# Get tunnel ID
TUNNEL_ID=$(cloudflared tunnel list | grep campus-robot | awk '{print $1}')

# Create config
mkdir -p ~/.cloudflared
cat > ~/.cloudflared/config.yml <<EOF
tunnel: $TUNNEL_ID
credentials-file: /home/pi/.cloudflared/$TUNNEL_ID.json

ingress:
  - service: http://localhost:5000
EOF

# Start tunnel
cloudflared tunnel run campus-robot
```

---

## Comparison Table

| Feature         | ngrok (Free) | Cloudflare Tunnel | Port Forwarding      |
| --------------- | ------------ | ----------------- | -------------------- |
| Cost            | Free         | Free              | Free                 |
| Permanent URL   | ❌ (Changes) | ✅                | ✅ (with DynamicDNS) |
| HTTPS           | ✅           | ✅                | ⚠️ (needs setup)     |
| Router Config   | ❌           | ❌                | ✅ Required          |
| DDoS Protection | ❌           | ✅                | ❌                   |
| Auto-restart    | ⚠️ Manual    | ✅                | ✅                   |
| **Recommended** | Testing      | **Production**    | Alternative          |

---

## Troubleshooting

### "Tunnel credentials not found"

**Solution:** Ensure credentials file path in config matches actual file:

```bash
ls ~/.cloudflared/*.json
# Update config.yml with correct path
```

### Tunnel starts but can't connect

**Solution:** Check backend is running:

```bash
curl http://localhost:5000/health
```

### DNS not resolving

**Solution:** Wait 2-5 minutes for DNS propagation, or use free `.trycloudflare.com` URL.

---

## Production Deployment Flow

**On Raspberry Pi:**

1. Start backend: `python3 app.py`
2. Start Cloudflare Tunnel: `sudo systemctl start cloudflared`
3. Get URL: Check logs or use configured hostname

**On Development Machine:**

1. Update `.env.local` with Cloudflare URL
2. Test: `npm run dev`
3. Deploy: `vercel --prod`

**You're live!** 🚀

---

## Monitoring

Check tunnel status:

```bash
# Check service
sudo systemctl status cloudflared

# View logs
sudo journalctl -u cloudflared -f

# List tunnels
cloudflared tunnel list
```

---

## Recommended: Cloudflare Tunnel

For your campus robot project, I recommend **Cloudflare Tunnel** because:

1. ✅ **Free & permanent** (best of both worlds)
2. ✅ **No router hassle** (IT department doesn't need to configure anything)
3. ✅ **Automatic HTTPS** (secure by default)
4. ✅ **Enterprise-grade infrastructure** (Cloudflare's global network)
5. ✅ **Easy to manage** (systemd service, auto-restart)

Perfect for university deployment where you might not have router access!
