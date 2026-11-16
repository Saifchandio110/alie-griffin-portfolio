import { supabaseAnonKey, supabaseUrl } from '@/lib/env';

// Plain XHR so we can show real upload progress (the Supabase JS client has no progress callback).
export function uploadWithProgress(
  path: string,
  file: File,
  accessToken: string,
  onProgress: (percent: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${supabaseUrl}/storage/v1/object/artworks/${path}`);
    xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
    xhr.setRequestHeader('apikey', supabaseAnonKey);
    xhr.setRequestHeader('x-upsert', 'false');
    xhr.setRequestHeader('cache-control', 'max-age=31536000');
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
        return;
      }
      let message = `Upload failed (error ${xhr.status}).`;
      try {
        const body = JSON.parse(xhr.responseText) as { message?: string };
        if (body.message) message = `Upload failed: ${body.message}`;
      } catch {
        // keep the default message
      }
      reject(new Error(message));
    };
    xhr.onerror = () => reject(new Error('Network error during upload. Check your connection.'));
    xhr.ontimeout = () => reject(new Error('The upload timed out. Try again.'));
    xhr.send(file);
  });
}
