export function renderSkeletonGrid(count: number = 4): string {
  let cardsHtml = '';
  for (let i = 0; i < count; i++) {
    cardsHtml += `
      <div class="card" style="padding: var(--spacing-16); height: 360px; display: flex; flex-direction: column; justify-content: space-between; background: var(--color-white);">
        <div>
          <div style="width: 100%; aspect-ratio: 1/1; background: var(--color-mint); border-radius: var(--radius-image); margin-bottom: 12px; animation: pulse 1.5s infinite;"></div>
          <div style="height: 20px; width: 80%; background: var(--color-mint-line); border-radius: 4px; margin-bottom: 8px;"></div>
          <div style="height: 14px; width: 50%; background: var(--color-mint-line); border-radius: 4px;"></div>
        </div>
        <div style="height: 28px; width: 60%; background: var(--color-mint-line); border-radius: 4px;"></div>
      </div>
    `;
  }
  return `
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: var(--spacing-24);">
      ${cardsHtml}
    </div>
  `;
}

export function renderEmptyState(message: string, actionText?: string, actionHref?: string): string {
  return `
    <div class="card" style="text-align: center; padding: var(--spacing-48); background: var(--color-mint); border-color: var(--color-mint-line);">
      <div style="font-size: 3rem; margin-bottom: var(--spacing-16);">🏸</div>
      <h3 style="font-family: var(--font-display); font-size: 1.5rem; color: var(--color-court); margin-bottom: var(--spacing-8);">
        ${message}
      </h3>
      ${
        actionText && actionHref
          ? `<a href="${actionHref}" data-link class="btn btn-primary" style="margin-top: var(--spacing-16);">${actionText}</a>`
          : ''
      }
    </div>
  `;
}

export function renderErrorState(message: string, retryCallbackName: string = 'location.reload()'): string {
  return `
    <div class="card" style="text-align: center; padding: var(--spacing-48); border-color: var(--color-danger); background: #fdf2f2;">
      <div style="font-size: 3rem; margin-bottom: var(--spacing-16); color: var(--color-danger);">⚠️</div>
      <h3 style="font-family: var(--font-display); font-size: 1.5rem; color: var(--color-danger); margin-bottom: var(--spacing-8);">
        Đã xảy ra lỗi tải dữ liệu
      </h3>
      <p style="color: var(--color-muted); margin-bottom: var(--spacing-16);">${message}</p>
      <button onclick="${retryCallbackName}" class="btn btn-secondary">Thử lại</button>
    </div>
  `;
}
