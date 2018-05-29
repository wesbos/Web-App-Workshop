import wait from 'waait';

export function takePhoto(video, canvas, strip) {
  console.log('Taking photooo');
  document.body.classList.add('taking');
  const data = canvas.toDataURL('image/jpg');
  const img = document.createElement('img');
  img.src = data;
  const link = document.createElement('a');
  link.setAttribute('download', `handsome-${Date.now()}.jpg`);
  link.setAttribute('href', data);
  link.classList.add('full');
  link.appendChild(img);
  strip.insertBefore(link, strip.firstChild);
  setTimeout(() => {
    link.classList.remove('full');
    document.body.classList.remove('taking');
  }, 250);
}

export async function countdown(video, canvas, strip) {
  const span = document.querySelector('.countdown');
  span.textContent = 3;
  await wait(1000);
  span.textContent = 2;
  await wait(1000);
  span.textContent = 1;
  await wait(500);
  span.textContent = '!!🧀!!';
  await wait(200);
  span.textContent = '';
  await wait(300);
  takePhoto(video, canvas, strip);
}
