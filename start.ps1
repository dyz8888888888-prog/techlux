$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://localhost:3000/')
$listener.Start()
Write-Host "Server started at http://localhost:3000"
Write-Host "Press Ctrl+C to stop the server"

while($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $path = $request.Url.LocalPath
    if($path -eq '/') {
        $path = '/home.html'
    }

    $filePath = Join-Path $PSScriptRoot $path.TrimStart('/')

    if(Test-Path $filePath) {
        $content = [System.IO.File]::ReadAllBytes($filePath)
        $extension = [System.IO.Path]::GetExtension($filePath)

        switch($extension) {
            '.html' { $response.ContentType = 'text/html; charset=utf-8' }
            '.css' { $response.ContentType = 'text/css; charset=utf-8' }
            '.js' { $response.ContentType = 'application/javascript; charset=utf-8' }
            '.png' { $response.ContentType = 'image/png' }
            '.jpg' { $response.ContentType = 'image/jpeg' }
            '.jpeg' { $response.ContentType = 'image/jpeg' }
            '.ico' { $response.ContentType = 'image/x-icon' }
        }

        $response.ContentLength64 = $content.Length
        $response.OutputStream.Write($content, 0, $content.Length)
    } else {
        $response.StatusCode = 404
        $response.Close()
        continue
    }

    $response.Close()
}

$listener.Stop()
