$pass = "IiWrp9Vvw4Xi1z4U"
$cluster = "dwjinmykgtvnsroumrj"
$host_ = "aws-0-us-east-2.pooler.supabase.com"
$port = "5432"
$options = "--cluster=$cluster"
# Note: this is for a local connectivity test only.
# The real password is already in .env and .env.local.
$conn = "postgresql://postgres:${pass}@${host_}:${port}/postgres?options=--cluster%3D${cluster}"

Write-Host "Testing connection:"
Write-Host $conn

# Use psql if available, otherwise report that we need it.
if (Get-Command psql -ErrorAction SilentlyContinue) {
    psql $conn -c "SELECT 1 as ok" 2>&1
} else {
    Write-Host "psql not found. Install postgresql-client or test with the Node script instead."
}
