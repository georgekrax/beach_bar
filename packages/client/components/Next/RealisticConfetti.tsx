import React from "react";
import ReactCanvasConfetti, { IProps } from "react-canvas-confetti";

export class RealisticConfetti extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.animationInstance = null;
  }

  animationInstance: any = null;

  static displayName = "NextRealisticConfetti";

  makeShot = (particleRatio: number, opts: IProps) => {
    if (this.animationInstance)
      this.animationInstance({
        ...opts,
        ...this.props,
        origin: { ...this.props.origin, y: 0.7 },
        particleCount: Math.floor(200 * particleRatio),
      });
  };

  fire = () => {
    this.makeShot(0.25, { spread: 26, startVelocity: 55 });

    this.makeShot(0.2, { spread: 60 });

    this.makeShot(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });

    this.makeShot(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });

    this.makeShot(0.1, { spread: 120, startVelocity: 45 });
  };

  getInstance = instance => (this.animationInstance = instance);

  render() {
    return (
      <ReactCanvasConfetti
        refConfetti={this.getInstance}
        style={{
          position: "fixed",
          pointerEvents: "none",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          zIndex: 99999,
        }}
        {...this.props}
      />
    );
  }
}
