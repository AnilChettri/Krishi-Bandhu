# Fix all translation errors in FarmGuard dashboard
$dashboardFile = "components\dashboard\enhanced-dashboard.tsx"
$content = Get-Content $dashboardFile -Raw

# Define all replacements
$replacements = @{
    "t\('common\.refresh_data'\)" = "'Refresh Data'"
    "t\('market\.title'\)" = "'Market Prices'"
    "t\('market\.loading'\)" = "'Loading market data'"
    "t\('market\.error'\)" = "'Market data unavailable'"
    "t\('market\.noData'\)" = "'No market data available'"
    "t\('market\.priceChange'\)" = "'Price Change'"
    "t\('notifications\.title'\)" = "'Notifications'"
    "t\('notifications\.markRead'\)" = "'Mark as Read'"
    "t\('notifications\.clear'\)" = "'Clear All'"
    "t\('notifications\.empty'\)" = "'No notifications'"
    "t\('dashboard\.viewAll'\)" = "'View All'"
    "t\('dashboard\.alerts'\)" = "'Alerts'"
    "t\('dashboard\.noAlerts'\)" = "'No alerts'"
    "t\('dashboard\.summary'\)" = "'Summary'"
}

# Apply all replacements
foreach($pattern in $replacements.Keys) {
    $content = $content -replace $pattern, $replacements[$pattern]
}

# Save the fixed content
Set-Content $dashboardFile $content -Encoding UTF8

Write-Host "✅ Fixed all translation errors in dashboard component"
Write-Host "🔄 Now run: npm run build"