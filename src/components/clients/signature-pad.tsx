
'use client';

import * as React from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@/components/ui/button';
import { RefreshCw, Save } from 'lucide-react';
import Image from 'next/image';

type SignaturePadProps = {
  onSave: (dataUrl: string) => void;
  initialUrl?: string | null;
};

export default function SignaturePadComponent({ onSave, initialUrl }: SignaturePadProps) {
  const sigPad = React.useRef<SignatureCanvas | null>(null);
  const [dataURL, setDataURL] = React.useState<string | null>(initialUrl || null);
  const [isSigned, setIsSigned] = React.useState(false);

  React.useEffect(() => {
    if (initialUrl) {
      setDataURL(initialUrl);
      if (sigPad.current) {
        // Need to make sure the canvas is cleared before loading new data
        // to avoid ghosting if the new data is smaller.
        sigPad.current.clear();
        sigPad.current.fromDataURL(initialUrl);
      }
    } else {
        // If there's no initial URL, clear the canvas and state
        sigPad.current?.clear();
        setDataURL(null);
    }
  }, [initialUrl]);

  const handleDrawEnd = () => {
    if (sigPad.current && !sigPad.current.isEmpty()) {
      setIsSigned(true);
    }
  };

  const clear = () => {
    sigPad.current?.clear();
    setDataURL(null);
    setIsSigned(false);
  };

  const save = () => {
    if (sigPad.current && !sigPad.current.isEmpty()) {
      const url = sigPad.current.toDataURL('image/png');
      setDataURL(url);
      onSave(url);
      setIsSigned(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative rounded-md border bg-background p-2">
         <SignatureCanvas
            ref={sigPad}
            onEnd={handleDrawEnd}
            canvasProps={{ 
              className: 'w-full h-48 rounded-md',
              style: { touchAction: 'none' } 
            }}
          />
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={clear}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Clear
        </Button>
        <Button type="button" onClick={save} disabled={!isSigned}>
          <Save className="mr-2 h-4 w-4" />
          Save Signature
        </Button>
      </div>
       {dataURL && (
         <div className="space-y-2">
            <h4 className="text-sm font-medium">Saved Signature Preview:</h4>
            <div className="relative aspect-[4/1] w-full max-w-sm rounded-md border p-2">
              <Image src={dataURL} alt="Client's signature" fill className="object-contain" />
            </div>
         </div>
      )}
    </div>
  );
}
