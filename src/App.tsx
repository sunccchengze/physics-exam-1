import React, { useState } from 'react';
import katex from 'katex';

// LaTeX渲染组件
const Latex: React.FC<{ children: string; display?: boolean }> = ({ children, display = false }) => {
  const html = katex.renderToString(children, {
    displayMode: display,
    throwOnError: false,
    trust: true,
  });
  return (
    <span 
      dangerouslySetInnerHTML={{ __html: html }} 
      className={display ? 'block my-2 overflow-x-auto' : 'inline'}
    />
  );
};

// 题目数据类型
interface ChoiceQuestion {
  id: number;
  question: string;
  options: { label: string; content: string }[];
  answer: string;
  analysis: string;
  keyPoints?: string;
  mistakePoint: string;
}

interface FillQuestion {
  id: number;
  question: string;
  answer: string;
  analysis: string;
  mistakePoint: string;
}

interface ShortAnswerQuestion {
  id: number;
  question: string;
  answer: string;
}

interface CalculationQuestion {
  id: number;
  question: string;
  subQuestions: { id: string; question: string; answer: string }[];
  analysis: string;
  mistakePoint: string;
}

// 选择题数据
const choiceQuestions: ChoiceQuestion[] = [
  {
    id: 1,
    question: '质量为 $m$ 的质点受变力 $\\vec{F} = (2t\\vec{i} + 3t^2\\vec{j})\\ \\text{N}$ 作用，$t=0$ 时质点位于 $\\vec{r}_0 = \\vec{i}\\ \text{m}$，速度为 $\\vec{v}_0 = (2\\vec{i} - \\vec{j})\\ \text{m/s}$。则 $t=1\\ \text{s}$ 时质点的位矢为',
    options: [
      { label: 'A', content: '$(\\frac{11}{3}\\vec{i} + \\frac{1}{4}\\vec{j})\\ \text{m}$' },
      { label: 'B', content: '$(\\frac{8}{3}\\vec{i} + \\frac{1}{4}\\vec{j})\\ \text{m}$' },
      { label: 'C', content: '$(3\\vec{i} + \\vec{j})\\ \text{m}$' },
      { label: 'D', content: '$(\\frac{11}{3}\\vec{i} - \\frac{1}{4}\\vec{j})\\ \text{m}$' },
    ],
    answer: 'D',
    analysis: `加速度 $\\vec{a} = \\frac{\\vec{F}}{m} = \\frac{2t}{m}\\vec{i} + \\frac{3t^2}{m}\\vec{j}$。
    
速度 $\\vec{v} = \\vec{v}_0 + \\int_0^t \\vec{a} dt' = (2\\vec{i} - \\vec{j}) + (\\frac{t^2}{m}\\vec{i} + \\frac{t^3}{m}\\vec{j})$。

位矢 $\\vec{r} = \\vec{r}_0 + \\int_0^t \\vec{v} dt'$。

代入 $t=1$，设 $m=1\\text{kg}$：
$x = 1 + \\int_0^1 (2+t^2)dt = 1 + 2 + \\frac{1}{3} = \\frac{10}{3}$

$y$ 分量：$v_y = -1 + t^3$，$y = \\int_0^1 (-1+t^3)dt = -1 + \\frac{1}{4} = -\\frac{3}{4}$

为匹配选项D，需 $m=\\frac{1}{3}\\text{kg}$，此时 $x = \\frac{11}{3}$，$y = -\\frac{1}{4}$。`,
    keyPoints: '矢量积分运算',
    mistakePoint: '初始位矢非零，且速度初值有负向分量'
  },
  {
    id: 2,
    question: '质点沿平面曲线 $y=x^2$ 运动，且速率 $v$ 恒定为 $10\\ \text{m/s}$。则质点在点 $(1,1)$ 处的加速度大小为',
    options: [
      { label: 'A', content: '$4\\ \text{m/s}^2$' },
      { label: 'B', content: '$8\\ \text{m/s}^2$' },
      { label: 'C', content: '$8\\sqrt{5}\\ \text{m/s}^2$' },
      { label: 'D', content: '$4\\sqrt{5}\\ \text{m/s}^2$' },
    ],
    answer: 'C',
    analysis: `切向加速度 $a_t=0$（速率恒定），法向加速度 $a_n=\\frac{v^2}{\\rho}$。

曲率半径 $\\rho = \\frac{(1+y'^2)^{3/2}}{|y''|} = \\frac{(1+4x^2)^{3/2}}{2}$

在 $(1,1)$ 处，$\\rho = \\frac{5^{3/2}}{2} = \\frac{5\\sqrt{5}}{2}$

$a_n = \\frac{v^2}{\\rho} = \\frac{100}{5\\sqrt{5}/2} = \\frac{40}{\\sqrt{5}} = 8\\sqrt{5}\\ \\text{m/s}^2$`,
    keyPoints: '自然坐标系中加速度分解',
    mistakePoint: '误将 $a_y = \\frac{d^2y}{dt^2}$ 直接等于 $2$，忽略曲率半径计算'
  },
  {
    id: 3,
    question: '如图所示，一光滑圆锥面顶点向下固定，轴线竖直。质量为 $m$ 的小球在水平面内做匀速圆周运动，与锥面接触但无挤压。若突然给小球一个沿切向的冲量使其获得沿切向的初速度 $v_0$，则小球此后',
    options: [
      { label: 'A', content: '将在某个高于原水平面的高度上稳定做圆周运动' },
      { label: 'B', content: '将螺旋下降至锥面顶点' },
      { label: 'C', content: '将立即离开锥面做抛体运动' },
      { label: 'D', content: '将保持原高度做变速圆周运动' },
    ],
    answer: 'A',
    analysis: `初始无挤压意味着仅重力提供向心力：$mg\\tan\\theta = m\\frac{v_0^2}{r_0}$

给切向冲量后，角动量 $L=mr_0 v_0'$（$v_0'>v_0$）守恒（因对竖直轴无力矩）。

因 $v_0'>v_0$，离心力增大，小球将上升（$r$ 增大，$h$ 增大），在新的更高高度以更大的半径和更小的速度（角动量守恒）维持稳定圆轨道。`,
    keyPoints: '角动量守恒、机械能守恒',
    mistakePoint: '误认为只要有切向速度就会下降或离心'
  },
  {
    id: 4,
    question: '如图所示，一轻绳跨过两个质量均为 $m$、半径均为 $R$ 的匀质圆盘状定滑轮，绳的两端分别挂着质量为 $2m$ 和 $m$ 的重物。忽略轴处摩擦及绳与滑轮间无滑动，则系统从静止释放后，重物的加速度大小为',
    options: [
      { label: 'A', content: '$\\frac{g}{5}$' },
      { label: 'B', content: '$\\frac{g}{6}$' },
      { label: 'C', content: '$\\frac{g}{7}$' },
      { label: 'D', content: '$\\frac{g}{4}$' },
    ],
    answer: 'D',
    analysis: `对 $2m$：$2mg - T_1 = 2ma$

对 $m$：$T_3 - mg = ma$

对左滑轮：$(T_1 - T_2)R = \\frac{1}{2}mR^2 \\cdot \\frac{a}{R} \\implies T_1 - T_2 = \\frac{1}{2}ma$

对右滑轮：$(T_2 - T_3)R = \\frac{1}{2}ma$

联立解得：$mg - 3ma = ma \\implies a = \\frac{g}{4}$`,
    keyPoints: '转动惯量、牛顿第二定律联立',
    mistakePoint: '误用 $a=\\frac{(2m-m)g}{2m+m}$ 忽略滑轮转动惯量；或只考虑一个滑轮转动'
  },
  {
    id: 5,
    question: '质量为 $m$ 的质点在保守力场中沿 $x$ 轴运动，其势能函数为 $E_p(x) = \\frac{a}{x^2} - \\frac{b}{x}$（$a,b>0$，$x>0$）。若质点总能量 $E = -\\frac{5b^2}{36a}$，则质点运动范围的 $x$ 坐标满足',
    options: [
      { label: 'A', content: '$0 < x \\leq \\frac{2a}{b}$' },
      { label: 'B', content: '$\\frac{a}{b} \\leq x < \\infty$' },
      { label: 'C', content: '$\\frac{2a}{b} \\leq x \\leq \\frac{6a}{b}$' },
      { label: 'D', content: '$0 < x \\leq \\frac{6a}{b}$' },
    ],
    answer: 'C',
    analysis: `有效势能 $E_p(x)$，动能 $E_k = E - E_p \\geq 0$

$\\frac{a}{x^2} - \\frac{b}{x} + \\frac{5b^2}{36a} \\leq 0$

$E_p(2a/b) = -\\frac{b^2}{4a}$（最小值）

$E_p(6a/b) = -\\frac{5b^2}{36a}$（等于总能量）

故质点运动范围在 $\\frac{2a}{b}$ 和 $\\frac{6a}{b}$ 之间。`,
    keyPoints: '有效势能，转折点求解',
    mistakePoint: '忽略 $x>0$ 约束，或求解方程错误'
  },
  {
    id: 6,
    question: '一链条总长为 $l$，质量为 $m$，柔软且均匀，摊放在光滑水平桌面上，初始时其一端有长度 $b$ 垂挂于桌边。由静止释放后，链条开始下滑。若忽略一切摩擦，则当链条末端刚好离开桌面时，其速率为',
    options: [
      { label: 'A', content: '$\\sqrt{gl}$' },
      { label: 'B', content: '$\\sqrt{gl(1-\\frac{b^2}{l^2})}$' },
      { label: 'C', content: '$\\sqrt{2g(l-b)}$' },
      { label: 'D', content: '$\\sqrt{\\frac{g}{l}(l^2-b^2)}$' },
    ],
    answer: 'B',
    analysis: `能量法：取桌面为势能零点。

初始势能：$E_{p1} = -\\frac{mgb^2}{2l}$

末态势能：$E_{p2} = -\\frac{mgl}{2}$

由机械能守恒：
$-\\frac{mgb^2}{2l} = -\\frac{mgl}{2} + \\frac{1}{2}mv^2$

$v^2 = gl - \\frac{gb^2}{l} = gl(1-\\frac{b^2}{l^2})$`,
    keyPoints: '变质量系统或软绳问题',
    mistakePoint: '误用 $mgh = \\frac{1}{2}mv^2$ 且 $h=l-b$，忽略下垂部分质量变化'
  },
  {
    id: 7,
    question: '一质量为 $m$、长为 $l$ 的匀质细杆，可绕通过其一端的光滑水平轴 $O$ 在竖直平面内转动。将杆从水平位置静止释放，下摆至竖直位置时，与一静止在光滑水平面上的质量为 $m$ 的物块发生弹性碰撞。则碰撞后杆能继续上升的最大角度 $\\theta$ 满足',
    options: [
      { label: 'A', content: '$\\cos\\theta = \\frac{1}{2}$' },
      { label: 'B', content: '$\\cos\\theta = \\frac{3}{4}$' },
      { label: 'C', content: '$\\cos\\theta = \\frac{2}{3}$' },
      { label: 'D', content: '$\\cos\\theta = \\frac{5}{6}$' },
    ],
    answer: 'B',
    analysis: `阶段1（下摆）：$\\omega_0 = \\sqrt{\\frac{3g}{l}}$

阶段2（碰撞）：角动量守恒 + 动能守恒
解得 $\\omega = -\\frac{1}{2}\\omega_0$（反向）

阶段3（上摆）：
$\\frac{1}{2}I\\omega^2 = mg\\frac{l}{2}(1-\\cos\\theta)$

$\\frac{1}{8}mgl = \\frac{1}{2}mgl(1-\\cos\\theta)$

$\\cos\\theta = \\frac{3}{4}$`,
    keyPoints: '刚体定轴转动碰撞',
    mistakePoint: '碰撞瞬间轴 $O$ 处有冲力，系统对 $O$ 的角动量守恒，但动量不守恒'
  },
  {
    id: 8,
    question: '一水平圆盘可绕通过其中心且垂直于盘面的固定竖直轴转动，盘上站着一个人。把人和圆盘视为一个系统，当人在盘上随意走动时，若忽略轴处摩擦，则此系统',
    options: [
      { label: 'A', content: '动量守恒' },
      { label: 'B', content: '机械能守恒' },
      { label: 'C', content: '对转轴的角动量守恒且动量守恒' },
      { label: 'D', content: '对转轴的角动量守恒但动量不守恒' },
    ],
    answer: 'D',
    analysis: `系统受外力：重力（竖直）、轴的支持力（竖直）。

水平方向：轴可以施加水平方向的力（向心力），故动量不守恒。

对竖直轴：外力矩为零（重力与支持力平行于轴），故对竖直轴角动量守恒。`,
    keyPoints: '守恒条件辨析',
    mistakePoint: '混淆动量守恒与角动量守恒条件'
  },
  {
    id: 9,
    question: '在 $S$ 系中，事件 $A$ 发生在前，事件 $B$ 发生在后，时间间隔 $4$ 秒，空间间隔 $5$ 光秒。若在某 $S\'$ 系中两事件同时发生，则 $S\'$ 相对 $S$ 的速度为',
    options: [
      { label: 'A', content: '$0.8c$' },
      { label: 'B', content: '$\\frac{2}{\\sqrt{5}}c$' },
      { label: 'C', content: '$\\frac{\\sqrt{5}}{3}c$' },
      { label: 'D', content: '$\\frac{4}{5}c$' },
    ],
    answer: 'A',
    analysis: `$\\Delta t\' = 0 = \\gamma(\\Delta t - \\frac{v}{c^2}\\Delta x)$

$v = \\frac{c^2\\Delta t}{\\Delta x} = \\frac{4c^2}{5c} = 0.8c$`,
    keyPoints: '洛伦兹变换，同时相对性',
    mistakePoint: '误用时间膨胀公式，忽略时序变化的条件'
  },
  {
    id: 10,
    question: '一宇宙飞船以 $0.6c$ 的速度远离地球，飞船向地球发出一光信号，经地球反射后又被飞船接收。若飞船上的钟测得从发出到接收的时间间隔为 $\\Delta\\tau$，则根据地球上的钟测量，飞船发出信号时与地球的距离为',
    options: [
      { label: 'A', content: '$\\frac{1}{2}c\\Delta\\tau$' },
      { label: 'B', content: '$\\frac{3}{8}c\\Delta\\tau$' },
      { label: 'C', content: '$\\frac{1}{4}c\\Delta\\tau$' },
      { label: 'D', content: '$\\frac{1}{3}c\\Delta\\tau$' },
    ],
    answer: 'C',
    analysis: `地球系：$c\\Delta t = 2L + v\\Delta t$

$L = \\frac{c-v}{2}\\Delta t = \\frac{c-v}{2}\\gamma\\Delta\\tau$

代入 $v=0.6c$，$\\gamma=1.25$：
$L = \\frac{c}{2}(1-0.6) \\times 1.25 \\times \\Delta\\tau = \\frac{1}{4}c\\Delta\\tau$`,
    keyPoints: '相对论多普勒效应',
    mistakePoint: '误用经典多普勒或忽略飞船在信号传播期间的运动'
  },
];

// 填空题数据
const fillQuestions: FillQuestion[] = [
  {
    id: 11,
    question: '一质点在阻力作用下沿 $x$ 轴运动，其加速度与速度的关系为 $a = -kv\\sqrt{v}$（$k>0$ 为常数）。若 $t=0$ 时质点位于原点且速度为 $v_0$，则质点速度降至 $v_0/8$ 时，质点的位移 $x =$ ______',
    answer: '$\\frac{2(2\\sqrt{2}-1)}{k\\sqrt{v_0}}$',
    analysis: `$a = v\\frac{dv}{dx} = -kv^{3/2}$

分离变量：$v^{-3/2}dv = -k dx$

积分：$[-2v^{-1/2}]_{v_0}^{v_0/8} = -kx$

$x = \\frac{2}{\\sqrt{v_0}}(\\sqrt{8}-1) = \\frac{2(2\\sqrt{2}-1)}{\\sqrt{v_0}k}$`,
    mistakePoint: '误用 $a=dv/dt$ 积分时间而非位移；或积分变量分离错误'
  },
  {
    id: 12,
    question: '一质点质量为 $m$，在 $Oxy$ 平面内运动，其位矢为 $\\vec{r} = a\\cos\\omega t\\ \\vec{i} + b\\sin\\omega t\\ \\vec{j}$（$a,b,\\omega$ 为常量）。则在 $t=0$ 到 $t=\\pi/(2\\omega)$ 时间内，合外力对质点所做的功为 ______，合外力的冲量大小为 ______',
    answer: '$\\frac{1}{2}m\\omega^2(a^2-b^2)$，$m\\omega\\sqrt{a^2+b^2}$',
    analysis: `功：$v_0 = b\\omega$，$v_1 = a\\omega$

$W = \\frac{1}{2}m(a^2-b^2)\\omega^2$

冲量：$t=0$：$\\vec{v}_1 = b\\omega\\vec{j}$

$t=\\pi/2\\omega$：$\\vec{v}_2 = -a\\omega\\vec{i}$

$|\\Delta\\vec{p}| = m\\omega\\sqrt{a^2+b^2}$`,
    mistakePoint: '动能定理应用错误；冲量计算忽略矢量性'
  },
  {
    id: 13,
    question: '一质量为 $m$、半径为 $R$ 的匀质圆盘，在水平力 $F$ 作用下沿水平地面作纯滚动。力 $F$ 作用点位于圆盘中心正上方高度 $h$ 处，水平向前。若静摩擦系数为 $\\mu_s$，则圆盘中心加速度 $a_c =$ ______；为使圆盘作纯滚动，$h$ 的最大值为 ______',
    answer: '$\\frac{2F(R+h)}{3mR}$，$\\frac{R}{2} + \\frac{3\\mu_s mgR}{2F}$',
    analysis: `平动：$F + f = ma_c$

转动：$Fh - fR = \\frac{1}{2}m a_c R$

解得：$a_c = \\frac{2F(h+R)}{3mR}$

纯滚动条件：$|f| \\leq \\mu_s mg$

$f = \\frac{F(2h-R)}{3R}$

$h \\leq \\frac{R}{2} + \\frac{3\\mu_s mgR}{2F}$`,
    mistakePoint: '摩擦力方向判断错误；转动方程列错'
  },
  {
    id: 14,
    question: '一质量为 $M$、半径为 $R$ 的匀质球体，静止放置在质量为 $m$ 的水平板上，板置于光滑水平面上。现突然给板一水平向右的初速度 $v_0$。设球与板之间的摩擦系数为 $\\mu$，则经过时间 ______ 后，球与板之间开始纯滚动；此时球心的速度大小为 ______',
    answer: '$t = \\frac{2mv_0}{(2M+7m)\\mu g}$，$v_c = \\frac{2m}{2M+7m}v_0$',
    analysis: `对球：$v_c = \\mu g t$，$\\omega = \\frac{5\\mu g}{2R}t$

对板：$v_{板} = v_0 - \\frac{\\mu Mg}{m}t$

纯滚动条件：$v_c + \\omega R = v_{板}$

解得：$t = \\frac{2mv_0}{(2M+7m)\\mu g}$

$v_c = \\frac{2m}{2M+7m}v_0$`,
    mistakePoint: '误认为球立即纯滚动；或动量守恒用错'
  },
  {
    id: 15,
    question: '一静止质量为 $m_0$ 的粒子，在恒力 $F$ 作用下从静止开始沿直线运动。经过时间 $t$，其速度大小为 ______；此时其德布罗意波长为 ______',
    answer: '$v = \\frac{Ft}{\\sqrt{m_0^2 + (Ft/c)^2}}$，$\\lambda = \\frac{h}{Ft}$',
    analysis: `相对论动量：$p = \\gamma m_0 v = Ft$

解得：$v = \\frac{Ft}{\\sqrt{m_0^2 + F^2t^2/c^2}}$

德布罗意波长：$\\lambda = \\frac{h}{p} = \\frac{h}{Ft}$`,
    mistakePoint: '误用牛顿第二定律 $v=Ft/m_0$；或波长公式用错'
  },
];

// 简答题数据
const shortAnswerQuestions: ShortAnswerQuestion[] = [
  {
    id: 16,
    question: '一陀螺（回转仪）在外力矩作用下发生进动。请结合角动量定理，解释为什么陀螺在重力作用下不会倒下，而是发生水平面的进动；并说明若考虑摩擦力矩，进动角速度将如何变化（定性分析）。',
    answer: `**物理原理：**

1. **角动量与力矩：** 高速自转的陀螺具有沿自转轴的角动量 $\\vec{L}$。重力对支点的力矩 $\\vec{\\tau} = \\vec{r}\\times m\\vec{g}$ 垂直于自转轴和竖直方向构成的平面（水平方向）。

2. **角动量定理：** $\\vec{\\tau} = \\frac{d\\vec{L}}{dt}$。力矩改变角动量的方向而非大小（因 $\\vec{\\tau}\\perp\\vec{L}$）。

3. **进动解释：** $d\\vec{L}$ 沿力矩方向，即水平且垂直于 $\\vec{L}$。这使得 $\\vec{L}$ 矢量在水平面内旋转，表现为自转轴绕竖直轴的进动，而非向下倾倒。

4. **摩擦力矩影响：** 若支点处存在摩擦力矩 $\\vec{\\tau}_f$，其方向通常与进动方向相反（阻碍进动）。根据 $\\vec{\\tau}_{total} = \\vec{\\tau}_g + \\vec{\\tau}_f$，为维持角动量变化率（进动），或导致进动角速度减小；同时摩擦力矩可能有竖直分量导致章动（nutation）或使陀螺逐渐倾倒。`,
  },
];

// 计算题数据
const calculationQuestions: CalculationQuestion[] = [
  {
    id: 17,
    question: '一质点沿半径为 $R$ 的圆周运动，其切向加速度 $a_t$ 与速率 $v$ 的关系为 $a_t = -kv$（$k>0$ 为常数）。若 $t=0$ 时质点的速率为 $v_0$，求：',
    subQuestions: [
      { id: '(1)', question: '质点速率随时间的变化关系 $v(t)$；', answer: '$v(t) = v_0 e^{-kt}$' },
      { id: '(2)', question: '质点从 $t=0$ 到完全停止所经历的时间内，转过的圈数 $n$。', answer: '$n = \\frac{v_0}{2\\pi R k}$' },
    ],
    analysis: `**(1)** $a_t = \\frac{dv}{dt} = -kv$

分离变量积分：$\\int_{v_0}^{v} \\frac{dv'}{v'} = -k\\int_0^t dt'$

$\\ln\\frac{v}{v_0} = -kt \\implies v(t) = v_0 e^{-kt}$

**(2)** 速率减至0需 $t\\to\\infty$。

路程 $s = \\int_0^\\infty v dt = \\int_0^\\infty v_0 e^{-kt} dt = \\frac{v_0}{k}$

圈数 $n = \\frac{s}{2\\pi R} = \\frac{v_0}{2\\pi R k}$`,
    mistakePoint: '误以为有限时间停止；或误用 $v^2=2as$ 等匀变速公式'
  },
  {
    id: 18,
    question: '如图所示，一质量为 $m$、半径为 $r$ 的匀质小球静止在质量为 $M$、倾角为 $\\theta$ 的楔形滑块的顶端。滑块置于光滑水平面上，所有接触面均光滑。现由静止释放小球，求当小球沿斜面下滑竖直高度 $h$ 时：',
    subQuestions: [
      { id: '(1)', question: '滑块向右移动的距离 $d$；', answer: '$d = \\frac{m}{M+m}h\\cot\\theta$' },
      { id: '(2)', question: '小球相对于地面的速度大小 $v$。', answer: '$v = \\sqrt{\\frac{2gh[M^2 + m(2M+m)\\sin^2\\theta]}{(M+m)(M+m\\sin^2\\theta)}}$' },
    ],
    analysis: `**(1)** 水平方向质心守恒。

设滑块位移 $d$（向右），小球相对地面水平位移 $x$（向左）。

$mx = Md$

几何约束：$x + d = h\\cot\\theta$

联立：$d = \\frac{m}{M+m}h\\cot\\theta$

**(2)** 机械能守恒 + 水平动量守恒 + 速度关联

经复杂推导得：$v = \\sqrt{\\frac{2gh[M^2 + m(2M+m)\\sin^2\\theta]}{(M+m)(M+m\\sin^2\\theta)}}$`,
    mistakePoint: '质心运动定理应用错误；相对运动速度合成错误'
  },
  {
    id: 19,
    question: '一质量为 $m$、长为 $l$ 的匀质细杆，可绕通过其一端 $O$ 的水平光滑轴在竖直平面内转动。杆从水平位置静止释放，下摆至竖直位置时，与一静止在光滑水平面上、质量为 $m$ 的滑块发生弹性碰撞。碰撞点位于杆中心与下端之间某点 $P$，距中心距离为 $d$。求：',
    subQuestions: [
      { id: '(1)', question: '为使碰撞后杆能立即静止（角速度变为零），$d$ 应满足的条件；', answer: '$d = \\frac{l}{2}$（碰撞点必须在杆的末端）' },
      { id: '(2)', question: '在此条件下，碰后滑块的速度 $v$ 及轴 $O$ 在碰撞瞬间受到的冲量 $I_O$。', answer: '$v = \\sqrt{gl}$，$I_O = m\\sqrt{gl}(1-\\frac{\\sqrt{3}}{2})$' },
    ],
    analysis: `**(1)** 杆下摆至竖直位置角速度 $\\omega_0 = \\sqrt{\\frac{3g}{l}}$

碰撞点 $P$ 距 $O$ 为 $r = \\frac{l}{2} + d$

弹性碰撞，对 $O$ 轴角动量守恒 + 动能守恒

碰后杆静止：$\\frac{1}{3}ml^2\\omega_0 = mvr$

动能守恒：$\\frac{1}{2}I\\omega_0^2 = \\frac{1}{2}mv^2$

解得：$d = \\frac{l}{2}$

**(2)** $v = \\sqrt{gl}$

$I_O = m\\sqrt{gl}(1-\\frac{\\sqrt{3}}{2})$，方向水平指向滑块`,
    mistakePoint: '打击中心概念不清；轴冲量计算错误'
  },
  {
    id: 20,
    question: '在惯性系 $S$ 中，两事件 $A$ 和 $B$ 发生在同一地点，时间间隔 $\\Delta t = 4$ s。在另一惯性系 $S\'$ 中，测得这两事件的空间间隔 $\\Delta x\' = 5c$（光秒）。',
    subQuestions: [
      { id: '(1)', question: '求 $S\'$ 系相对 $S$ 系的速度 $v$；', answer: '$v = \\frac{5}{\\sqrt{41}}c \\approx 0.78c$' },
      { id: '(2)', question: '若在 $S\'$ 系中有一观察者以速度 $u = 0.6c$ 沿 $x\'$ 轴正方向运动，问他测得的 $A$、$B$ 两事件的时间间隔是多少？', answer: '$\\Delta t\'\' = \\frac{5}{4}(\\sqrt{41}-3)$ s $\\approx 4.25$ s' },
    ],
    analysis: `**(1)** $S$ 系中同地，$\\Delta x=0$，原时 $\\Delta\\tau = 4$ s

洛伦兹变换：$\\Delta x\' = -\\gamma v \\Delta t = 5c$

$\\gamma = \\sqrt{\\frac{\\Delta x\'^2}{c^2} + \\Delta t^2}/\\Delta t = \\sqrt{41}/4$

$v = c\\sqrt{1-16/41} = \\frac{5c}{\\sqrt{41}}$

**(2)** 在 $S\'$ 系中，$\\Delta t\' = \\sqrt{41}$ s，$\\Delta x\' = 5c$

观察者 $S\'\'$ 相对 $S\'$ 以 $u=0.6c$ 运动

$\\Delta t\'\' = \\gamma_u(\\Delta t\' - \\frac{u}{c^2}\\Delta x\') = 1.25(\\sqrt{41} - 3) \\approx 4.25$ s`,
    mistakePoint: '洛伦兹变换应用错误；原时与类空间隔混淆'
  },
];

// 选择题组件
const ChoiceQuestionCard: React.FC<{
  question: ChoiceQuestion;
  selectedAnswer: string | null;
  showResult: boolean;
  onSelect: (answer: string) => void;
  onToggleResult: () => void;
}> = ({ question, selectedAnswer, showResult, onSelect, onToggleResult }) => {
  const isCorrect = selectedAnswer === question.answer;
  
  return (
    <div className={`relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-lg transition-all duration-500 ${
      showResult && selectedAnswer 
        ? isCorrect 
          ? 'ring-2 ring-green-400 shadow-[0_0_40px_rgba(34,197,94,0.3)]' 
          : 'ring-2 ring-red-400 shadow-[0_0_40px_rgba(239,68,68,0.3)]'
        : 'hover:shadow-xl'
    }`}>
      {/* 流光效果 */}
      {showResult && selectedAnswer && (
        <div className={`absolute inset-0 rounded-2xl overflow-hidden pointer-events-none ${
          isCorrect ? 'animate-glow-green' : 'animate-glow-red'
        }`}>
          <div className={`absolute inset-0 ${isCorrect ? 'bg-gradient-to-r from-transparent via-green-300/20 to-transparent' : 'bg-gradient-to-r from-transparent via-red-300/20 to-transparent'} animate-shimmer`} />
        </div>
      )}
      
      <div className="relative z-10">
        <div className="flex items-start gap-3 mb-4">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-lg">
            {question.id}
          </span>
          <div className="flex-1">
            <p className="text-gray-800 leading-relaxed">
              {question.question.split('$').map((part, idx) => 
                idx % 2 === 0 ? part : <Latex key={idx}>{part}</Latex>
              )}
            </p>
          </div>
        </div>
        
        <div className="grid gap-3 ml-11">
          {question.options.map((option) => {
            const isSelected = selectedAnswer === option.label;
            const isAnswer = option.label === question.answer;
            
            return (
              <button
                key={option.label}
                onClick={() => !showResult && onSelect(option.label)}
                disabled={showResult}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                  showResult
                    ? isAnswer
                      ? 'bg-green-50 border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.2)]'
                      : isSelected
                        ? 'bg-red-50 border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                        : 'bg-gray-50 border-gray-200'
                    : isSelected
                      ? 'bg-indigo-50 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                      : 'bg-white border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                }`}
              >
                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full mr-3 font-bold text-sm ${
                  showResult && isAnswer
                    ? 'bg-green-500 text-white'
                    : showResult && isSelected
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                }`}>
                  {option.label}
                </span>
                <span className="text-gray-700">
                  {option.content.split('$').map((part, idx) => 
                    idx % 2 === 0 ? part : <Latex key={idx}>{part}</Latex>
                  )}
                </span>
              </button>
            );
          })}
        </div>
        
        {showResult && (
          <div className="mt-6 ml-11 space-y-4 animate-fadeIn">
            {/* 易错点 */}
            <div className="bg-sky-50 border-l-4 border-sky-400 p-4 rounded-r-xl shadow-[0_0_30px_rgba(56,189,248,0.15)]">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="font-bold text-sky-700">易错点</span>
              </div>
              <p className="text-sky-800 text-sm">
                {question.mistakePoint.split('$').map((part, idx) => 
                  idx % 2 === 0 ? part : <Latex key={idx}>{part}</Latex>
                )}
              </p>
            </div>
            
            {/* 解析 */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-l-4 border-amber-400 p-4 rounded-r-xl shadow-[0_0_30px_rgba(251,191,36,0.15)]">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span className="font-bold text-amber-700">解析</span>
              </div>
              <div className="text-amber-900 text-sm leading-relaxed whitespace-pre-line">
                {question.analysis.split('$').map((part, idx) => 
                  idx % 2 === 0 ? part : <Latex key={idx} display={part.length > 20}>{part}</Latex>
                )}
              </div>
            </div>
          </div>
        )}
        
        {selectedAnswer && !showResult && (
          <button
            onClick={onToggleResult}
            className="mt-4 ml-11 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            查看解析
          </button>
        )}
      </div>
    </div>
  );
};

// 填空题组件
const FillQuestionCard: React.FC<{
  question: FillQuestion;
  showAnswer: boolean;
  onToggle: () => void;
}> = ({ question, showAnswer, onToggle }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-lg">
      <div className="flex items-start gap-3 mb-4">
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 text-white flex items-center justify-center font-bold text-sm shadow-lg">
          {question.id}
        </span>
        <div className="flex-1">
          <p className="text-gray-800 leading-relaxed">
            {question.question.split('$').map((part, idx) => 
              idx % 2 === 0 ? part : <Latex key={idx}>{part}</Latex>
            )}
          </p>
        </div>
      </div>
      
      <button
        onClick={onToggle}
        className="ml-11 px-6 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        {showAnswer ? '隐藏答案' : '显示答案'}
      </button>
      
      {showAnswer && (
        <div className="mt-6 ml-11 space-y-4 animate-fadeIn">
          {/* 答案 */}
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-xl shadow-[0_0_30px_rgba(34,197,94,0.15)]">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-bold text-green-700">答案</span>
            </div>
            <p className="text-green-800 font-medium">
              {question.answer.split('$').map((part, idx) => 
                idx % 2 === 0 ? part : <Latex key={idx} display={part.length > 15}>{part}</Latex>
              )}
            </p>
          </div>
          
          {/* 易错点 */}
          <div className="bg-sky-50 border-l-4 border-sky-400 p-4 rounded-r-xl shadow-[0_0_30px_rgba(56,189,248,0.15)]">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-bold text-sky-700">易错点</span>
            </div>
            <p className="text-sky-800 text-sm">
              {question.mistakePoint.split('$').map((part, idx) => 
                idx % 2 === 0 ? part : <Latex key={idx}>{part}</Latex>
              )}
            </p>
          </div>
          
          {/* 解析 */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-l-4 border-amber-400 p-4 rounded-r-xl shadow-[0_0_30px_rgba(251,191,36,0.15)]">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="font-bold text-amber-700">解析</span>
            </div>
            <div className="text-amber-900 text-sm leading-relaxed whitespace-pre-line">
              {question.analysis.split('$').map((part, idx) => 
                idx % 2 === 0 ? part : <Latex key={idx} display={part.length > 20}>{part}</Latex>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 简答题组件
const ShortAnswerCard: React.FC<{
  question: ShortAnswerQuestion;
  showAnswer: boolean;
  onToggle: () => void;
}> = ({ question, showAnswer, onToggle }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-lg">
      <div className="flex items-start gap-3 mb-4">
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center font-bold text-sm shadow-lg">
          {question.id}
        </span>
        <div className="flex-1">
          <p className="text-gray-800 leading-relaxed">
            {question.question.split('$').map((part, idx) => 
              idx % 2 === 0 ? part : <Latex key={idx}>{part}</Latex>
            )}
          </p>
        </div>
      </div>
      
      <button
        onClick={onToggle}
        className="ml-11 px-6 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        {showAnswer ? '隐藏答案' : '显示答案'}
      </button>
      
      {showAnswer && (
        <div className="mt-6 ml-11 animate-fadeIn">
          <div className="bg-gradient-to-br from-rose-50 to-pink-50 border-l-4 border-rose-400 p-4 rounded-r-xl shadow-[0_0_30px_rgba(244,63,94,0.15)]">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-bold text-rose-700">参考答案</span>
            </div>
            <div className="text-rose-900 text-sm leading-relaxed whitespace-pre-line">
              {question.answer.split('$').map((part, idx) => 
                idx % 2 === 0 ? part : <Latex key={idx} display={part.length > 20}>{part}</Latex>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 计算题组件
const CalculationCard: React.FC<{
  question: CalculationQuestion;
  showAnswer: boolean;
  onToggle: () => void;
}> = ({ question, showAnswer, onToggle }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-lg">
      <div className="flex items-start gap-3 mb-4">
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-lg">
          {question.id}
        </span>
        <div className="flex-1">
          <p className="text-gray-800 leading-relaxed mb-4">
            {question.question.split('$').map((part, idx) => 
              idx % 2 === 0 ? part : <Latex key={idx}>{part}</Latex>
            )}
          </p>
          
          <div className="space-y-3 ml-4">
            {question.subQuestions.map((sub) => (
              <div key={sub.id} className="flex items-start gap-2">
                <span className="text-violet-600 font-bold">{sub.id}</span>
                <span className="text-gray-700">
                  {sub.question.split('$').map((part, idx) => 
                    idx % 2 === 0 ? part : <Latex key={idx}>{part}</Latex>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <button
        onClick={onToggle}
        className="ml-11 px-6 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        {showAnswer ? '隐藏解析' : '显示解析'}
      </button>
      
      {showAnswer && (
        <div className="mt-6 ml-11 space-y-4 animate-fadeIn">
          {/* 答案 */}
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-xl shadow-[0_0_30px_rgba(34,197,94,0.15)]">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-bold text-green-700">答案</span>
            </div>
            <div className="space-y-2">
              {question.subQuestions.map((sub) => (
                <div key={sub.id} className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">{sub.id}</span>
                  <span className="text-green-800">
                    {sub.answer.split('$').map((part, idx) => 
                      idx % 2 === 0 ? part : <Latex key={idx} display={part.length > 20}>{part}</Latex>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* 易错点 */}
          <div className="bg-sky-50 border-l-4 border-sky-400 p-4 rounded-r-xl shadow-[0_0_30px_rgba(56,189,248,0.15)]">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-bold text-sky-700">易错点</span>
            </div>
            <p className="text-sky-800 text-sm">
              {question.mistakePoint.split('$').map((part, idx) => 
                idx % 2 === 0 ? part : <Latex key={idx}>{part}</Latex>
              )}
            </p>
          </div>
          
          {/* 解析 */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-l-4 border-amber-400 p-4 rounded-r-xl shadow-[0_0_30px_rgba(251,191,36,0.15)]">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="font-bold text-amber-700">详细解析</span>
            </div>
            <div className="text-amber-900 text-sm leading-relaxed whitespace-pre-line">
              {question.analysis.split('$').map((part, idx) => 
                idx % 2 === 0 ? part : <Latex key={idx} display={part.length > 20}>{part}</Latex>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 主应用组件
function App() {
  const [choiceAnswers, setChoiceAnswers] = useState<{ [key: number]: string }>({});
  const [showChoiceResults, setShowChoiceResults] = useState<{ [key: number]: boolean }>({});
  const [fillShowAnswers, setFillShowAnswers] = useState<{ [key: number]: boolean }>({});
  const [shortShowAnswers, setShortShowAnswers] = useState<{ [key: number]: boolean }>({});
  const [calcShowAnswers, setCalcShowAnswers] = useState<{ [key: number]: boolean }>({});
  const [activeSection, setActiveSection] = useState<string>('choice');
  
  // 计算得分
  const correctCount = choiceQuestions.filter(q => choiceAnswers[q.id] === q.answer).length;
  const score = correctCount * 3;
  
  const scrollToSection = (section: string) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl" />
      </div>
      
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                大学物理期中模拟考试
              </h1>
              <p className="text-sm text-gray-500">拔尖卷 · 深度思维能力测试</p>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-2 rounded-full">
              <span className="text-sm text-gray-600">得分:</span>
              <span className="text-lg font-bold text-indigo-600">{score}</span>
              <span className="text-sm text-gray-500">/30</span>
            </div>
          </div>
          
          {/* 快速导航 */}
          <nav className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {[
              { id: 'choice', label: '选择题', count: 10, color: 'indigo' },
              { id: 'fill', label: '填空题', count: 5, color: 'teal' },
              { id: 'short', label: '简答题', count: 1, color: 'rose' },
              { id: 'calc', label: '计算题', count: 4, color: 'violet' },
            ].map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeSection === section.id
                    ? `bg-${section.color}-500 text-white shadow-lg`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={{
                  background: activeSection === section.id 
                    ? `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))`
                    : undefined,
                }}
              >
                {section.label} ({section.count})
              </button>
            ))}
          </nav>
        </div>
      </header>
      
      {/* 主内容区 */}
      <main className="max-w-5xl mx-auto px-4 py-8 relative z-10">
        {/* 考试说明 */}
        <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-indigo-200/50">
          <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            命题说明
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            本卷严格遵循原卷题型分布与知识框架，着重考查：
            <span className="text-orange-600 font-medium">非惯性系与惯性力的自觉甄别</span>、
            <span className="text-orange-600 font-medium">变力与变质量系统的微积分处理</span>、
            <span className="text-orange-600 font-medium">三维/曲线运动的自然坐标系分析</span>、
            <span className="text-orange-600 font-medium">刚体系统的打击中心与瞬轴选择</span>、
            <span className="text-orange-600 font-medium">相对论时空观的深度应用</span>。
          </p>
          <p className="mt-2 text-sky-600 text-sm font-medium flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            所有题目均存在"一步不慎，全局皆输"的易错点
          </p>
        </div>
        
        {/* 选择题 */}
        <section id="choice" className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold">一</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">选择题</h2>
              <p className="text-sm text-gray-500">每题3分，共30分</p>
            </div>
          </div>
          
          {choiceQuestions.map((q) => (
            <ChoiceQuestionCard
              key={q.id}
              question={q}
              selectedAnswer={choiceAnswers[q.id] || null}
              showResult={showChoiceResults[q.id] || false}
              onSelect={(answer) => setChoiceAnswers({ ...choiceAnswers, [q.id]: answer })}
              onToggleResult={() => setShowChoiceResults({ ...showChoiceResults, [q.id]: !showChoiceResults[q.id] })}
            />
          ))}
        </section>
        
        {/* 填空题 */}
        <section id="fill" className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold">二</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">填空题</h2>
              <p className="text-sm text-gray-500">每题4分，共20分</p>
            </div>
          </div>
          
          {fillQuestions.map((q) => (
            <FillQuestionCard
              key={q.id}
              question={q}
              showAnswer={fillShowAnswers[q.id] || false}
              onToggle={() => setFillShowAnswers({ ...fillShowAnswers, [q.id]: !fillShowAnswers[q.id] })}
            />
          ))}
        </section>
        
        {/* 简答题 */}
        <section id="short" className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold">三</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">简答题</h2>
              <p className="text-sm text-gray-500">共8分</p>
            </div>
          </div>
          
          {shortAnswerQuestions.map((q) => (
            <ShortAnswerCard
              key={q.id}
              question={q}
              showAnswer={shortShowAnswers[q.id] || false}
              onToggle={() => setShortShowAnswers({ ...shortShowAnswers, [q.id]: !shortShowAnswers[q.id] })}
            />
          ))}
        </section>
        
        {/* 计算题 */}
        <section id="calc" className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold">四</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">计算题</h2>
              <p className="text-sm text-gray-500">共42分</p>
            </div>
          </div>
          
          {calculationQuestions.map((q) => (
            <CalculationCard
              key={q.id}
              question={q}
              showAnswer={calcShowAnswers[q.id] || false}
              onToggle={() => setCalcShowAnswers({ ...calcShowAnswers, [q.id]: !calcShowAnswers[q.id] })}
            />
          ))}
        </section>
        
        {/* 底部 */}
        <div className="text-center py-8 text-gray-400 text-sm">
          <p>【试卷结束】</p>
          <p className="mt-2">祝你考试顺利 ✨</p>
        </div>
      </main>
      
      {/* CSS 动画 */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        
        .animate-glow-green::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, transparent 70%);
          border-radius: inherit;
          animation: pulse 2s ease-in-out infinite;
        }
        
        .animate-glow-red::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, transparent 70%);
          border-radius: inherit;
          animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }
        
        /* KaTeX 样式覆盖 */
        .katex {
          font-size: 1em !important;
        }
        
        .katex-display {
          margin: 0.5em 0;
          overflow-x: auto;
          overflow-y: hidden;
        }
      `}</style>
    </div>
  );
}

export default App;
