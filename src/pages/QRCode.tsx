import { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download, Copy, Check, QrCode } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const QRCodePage = () => {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const menuUrl = window.location.origin;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(menuUrl);
    setCopied(true);
    toast.success('Link berhasil disalin!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const data = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    const blob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      canvas.width = 1024;
      canvas.height = 1200;
      if (ctx) {
        // Background
        ctx.fillStyle = '#1a1a1a';
        ctx.roundRect(0, 0, 1024, 1200, 32);
        ctx.fill();

        // White QR area
        ctx.fillStyle = '#ffffff';
        ctx.roundRect(62, 62, 900, 900, 24);
        ctx.fill();

        // QR code
        ctx.drawImage(img, 112, 112, 800, 800);

        // Text
        ctx.fillStyle = '#d4a574';
        ctx.font = 'bold 36px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Scan untuk lihat Menu', 512, 1040);

        ctx.fillStyle = '#888888';
        ctx.font = '24px sans-serif';
        ctx.fillText('WarungMedan', 512, 1090);

        // Download
        const link = document.createElement('a');
        link.download = 'warungmedan-qrcode.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        toast.success('QR Code berhasil diunduh!');
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      <Header />
      <main className="container py-8 max-w-lg mx-auto">
        <Card className="border-border/30 bg-card/80 backdrop-blur-sm shadow-luxury">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-3 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <QrCode className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="font-display text-2xl tracking-tight">QR Code Menu</CardTitle>
            <CardDescription className="text-muted-foreground">
              Cetak atau bagikan QR code ini agar pelanggan bisa langsung scan dan lihat menu
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            {/* QR Code */}
            <div
              ref={qrRef}
              className="rounded-2xl bg-white p-6 shadow-md border border-border/20"
            >
              <QRCodeSVG
                value={menuUrl}
                size={240}
                level="H"
                fgColor="#1a1a1a"
                bgColor="#ffffff"
                imageSettings={{
                  src: '',
                  height: 0,
                  width: 0,
                  excavate: false,
                }}
              />
            </div>

            {/* URL Display */}
            <div className="w-full rounded-xl bg-muted/50 border border-border/30 px-4 py-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Link Menu</p>
              <p className="text-sm font-medium text-foreground truncate">{menuUrl}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 w-full">
              <Button
                onClick={handleCopyLink}
                variant="outline"
                className="flex-1 gap-2"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Tersalin' : 'Salin Link'}
              </Button>
              <Button
                onClick={handleDownload}
                className="flex-1 gap-2"
              >
                <Download className="h-4 w-4" />
                Unduh QR
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default QRCodePage;
