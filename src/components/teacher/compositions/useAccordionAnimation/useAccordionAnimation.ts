import './useAccordionAnimation.scss';

export const nextFrame = (fn: () => void) => {
  window.requestAnimationFrame(() => window.requestAnimationFrame(fn));
};

export const useAccordionAnimation = (
  height: number | undefined = undefined
) => {
  const accordionEnter = (el: HTMLElement): void => {
    el.style.overflow = 'hidden';
    el.style.height = '0';
    nextFrame(() => {
      el.style.height = `${height ? height : el.scrollHeight}px`;
    });
  };
  const accordionLeave = (el: HTMLElement): void => {
    el.style.overflow = 'hidden';
    el.style.height = `${height ? height : el.scrollHeight}px`;
    nextFrame(() => {
      el.style.height = '0';
    });
  };
  const accordionAfterEnter = (el: HTMLElement): void => {
    el.style.height = '';
    el.style.overflow = '';
  };
  const accordionAfterLeave = (el: HTMLElement): void => {
    el.style.height = '';
    el.style.overflow = '';
  };
  return {
    nextFrame,
    accordionEnter,
    accordionLeave,
    accordionAfterEnter,
    accordionAfterLeave,
  };
};
