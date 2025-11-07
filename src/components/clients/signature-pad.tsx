
'use client';

import * as React from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@/components/ui/button';
import { RefreshCw, Save } from 'lucide-react';
import Image from 'next/image';

type SignaturePadProps = {
  onSave: (dataUrl: string) => void;
};

export default function SignaturePad({ onSave }: SignaturePadProps) {
  const sigPad = React.useRef<SignatureCanvas>(null);
  const [dataURL, setDataURL] = React.useState<string | null>(null);

  const clear = () => {
    sigPad.current?.clear();
    setDataURL(null);
  };

  const save = () => {
    if (sigPad.current) {
        const url = sigPad.current.toDataURL();
        setDataURL(url);
        onSave(url);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-background p-2">
        {dataURL ? (
            <div className="relative aspect-[2/1] w-full">
                <Image src={dataURL} alt="Client's signature" fill className="object-contain" />
            </div>
        ) : (
          <SignatureCanvas
            ref={sigPad}
            penColor="hsl(var(--primary))"
            canvasProps={{ className: 'w-full h-48 rounded-md' }}
          />
        )}
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={clear}>
          <RefreshCw className="mr-2" />
          Clear
        </Button>
        <Button type="button" onClick={save} disabled={!!dataURL}>
            <Save className="mr-2" />
            {dataURL ? 'Signature Saved' : 'Save Signature'}
        </Button>
      </div>
    </div>
  );
}
