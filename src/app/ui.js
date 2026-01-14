'use client';

import { useState, useEffect } from 'react';
import { toPng } from 'html-to-image';

export default function Client() {
  const [code, setCode] = useState('');
  const [html, setHtml] = useState('');

  useEffect(() => {
    fetch('/api/highlight', {
      method: 'POST',
      body: code
    })
      .then(res => res.text())
      .then(setHtml);
  }, [code]);

  const download = async () => {
    const node = document.getElementById('card');
    const dataUrl = await toPng(node, { pixelRatio: 2 });
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'dsa.png';
    a.click();
  };

  return (
    <div style={{ padding: 40 }}>
      <textarea
        onChange={e => setCode(e.target.value)}
        style={{ width: '100%', height: 120 }}
      />

      <div
        id="card"
        style={{
          background: '#1e1e1e',
          padding: 20,
          borderRadius: 12,
          marginTop: 20
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <button onClick={download}>Download</button>
    </div>
  );
}
