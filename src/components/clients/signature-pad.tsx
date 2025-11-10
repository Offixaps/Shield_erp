
'use client';

import * as React from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@/components/ui/button';
import { RefreshCw, Save } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type SignaturePadProps = {
  onSave: (dataUrl: string) => void;
  initialUrl?: string | null;
};

export default function SignaturePad({ onSave, initialUrl }: SignaturePadProps) {
  const sigPad = React.useRef<SignatureCanvas>(null);
  const [dataURL, setDataURL] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Set initial signature only once
    if (initialUrl && !dataURL) {
      setDataURL(initialUrl);
    }
  }, [initialUrl, dataURL]);
  
  const clear = () => {
    sigPad.current?.clear();
    setDataURL(null);
    onSave(''); // Notify parent that signature is cleared
  };

  const save = () => {
    if (sigPad.current && !sigPad.current.isEmpty()) {
      const url = sigPad.current.toDataURL();
      setDataURL(url);
      onSave(url);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative rounded-md border bg-background p-2">
        {dataURL && (
          <div className="relative aspect-[2/1] w-full">
            <Image src={dataURL} alt="Client's signature" fill className="object-contain" />
          </div>
        )}
        <div className={cn(dataURL && 'absolute inset-0 opacity-0 pointer-events-none')}>
           <SignatureCanvas
            ref={sigPad}
            penColor="hsl(var(--primary))"
            canvasProps={{ className: 'w-full h-48 rounded-md' }}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={clear}>
          <RefreshCw className="mr-2 h-4 w-4" />
          {dataURL ? 'Clear & Sign Again' : 'Clear'}
        </Button>
        <Button type="button" onClick={save} disabled={!!dataURL}>
            <Save className="mr-2 h-4 w-4" />
            {dataURL ? 'Signature Saved' : 'Save Signature'}
        </Button>
      </div>
    </div>
  );
}
