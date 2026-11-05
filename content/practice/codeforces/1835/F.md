---
title: "CF 1835F - 良好的图表"
description: "研究练习 6 答案中建议的“改进的”KS 检验。令 $X1、X2、ldots、Xn$ 为从连续分布函数 $F(x)$ 中得出的独立观测值。"
date: "2026-06-09T06:49:51+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "dfs-and-similar", "graph-matchings", "graphs", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1835
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 880 (Div. 1)"
rating: 3500
weight: 1835
solve_time_s: 64
verified: false
draft: false
---

[CF 1835F - 好图](https://codeforces.com/problemset/problem/1835/F)

 **评分：** 3500
 **标签：** 位掩码、dfs 和类似、图匹配、图、实现
 **求解时间：** 1m 4s
 **已验证：** 否

 ## 解决方案
 ## 练习 3.3.1.22 [_HM46_]

 研究练习 6 的答案中建议的“改进的”KS 测试。 

## 设置

 让$X_1, X_2, \ldots, X_n$从连续分布函数中得出的独立观察值$F(x)$。 表示为$F_n(x)$经验分布函数：$F_n(x) = \frac{1}{n}\sum_{i=1}^{n} \mathbf{1}_{\{X_i \le x\}}.$经典的柯尔莫哥洛夫-斯米尔诺夫统计量是$K_n^+ = \sup_x \bigl(F_n(x) - F(x)\bigr), \qquad K_n^- = \sup_x \bigl(F(x) - F_n(x)\bigr),$双边统计量为$K_n = \max(K_n^+, K_n^-).$练习 6 中提到的“改进的”KS 检验修改了统计量以解释$F_n(x)$在不同的值$F(x)$，类似于等式（4）中卡方统计中使用的权重。 具体来说，定义$K_n^\ast = \sup_{x} \frac{|F_n(x) - F(x)|}{\sqrt{F(x)(1 - F(x))}}, \eqno(22.1)$使边界附近的偏差$F(x) \approx 0$或者$F(x) \approx 1$在二项式近似下按其标准差按比例放大。 

我们被要求调查分布情况$K_n^\ast$及其与经典KS检验的实际效果对比。 

## 解决方案

 首先考虑经典经验分布的方差结构。 对于每个$x$,$n F_n(x)$具有带参数的二项分布$n$和$F(x)$。 因此，$\operatorname{Var}(F_n(x)) = \frac{F(x)(1 - F(x))}{n}.$经典的 KS 统计量$K_n$平等地对待所有偏差，而改进的统计量$K_n^\ast$将每个偏差按其标准偏差进行缩放：$\frac{F_n(x) - F(x)}{\sqrt{F(x)(1 - F(x)) / n}} = \sqrt{n}\,\frac{F_n(x) - F(x)}{\sqrt{F(x)(1 - F(x))}}.$这种变换稳定了方差$x \in [0,1]$。 因此，分布$\sqrt{n} K_n^\ast$渐近仅取决于标准化布朗桥过程$B(t)/\sqrt{t(1-t)}$， 在哪里$B(t)$是一个标准的布朗桥$[0,1]$。 根据 3.3.1 节的论证，经典 KS 统计量在分布上收敛：$\Pr\bigl(\sqrt{n} K_n \le x\bigr) \to 1 - 2\sum_{k=1}^{\infty}(-1)^{k-1} e^{-2 k^2 x^2}.$对于改进的统计量，类似的渐近行为是$\Pr\bigl(\sqrt{n} K_n^\ast \le x\bigr) \to \Pr\left(\sup_{0 < t < 1} \frac{|B(t)|}{\sqrt{t(1-t)}} \le x\right).$我们来分析一下这个过程。 让$t = \sin^2 \theta$,$0 < \theta < \pi/2$。 然后$\frac{dt}{d\theta} = 2 \sin \theta \cos \theta = \sin 2\theta, \qquad t(1-t) = \sin^2 \theta \cos^2 \theta = \frac{\sin^2 2\theta}{4}.$定义$Z(\theta) = 2 B(\sin^2 \theta) / \sin 2\theta$， 以便$K_n^\ast = \sup_\theta |Z(\theta)|$。 然后$Z(\theta)$是一个具有均值的高斯过程$0$和每个的单位方差$\theta$， 因为$\operatorname{Var}\bigl(B(t)/(t(1-t))^{1/2}\bigr) = \frac{t(1-t)}{t(1-t)} = 1.$然而，$Z(\theta)$与附近的区域表现出很强的相关性$\theta$。 可以应用高斯过程极值的经典技术（莱斯公式或皮坎兹常数）。 在实践中，对于中等$n$，临界值$K_n^\ast$比那些稍大$K_n$，反映了尾部权重的增加。 

为了说明这一点，假设$n = 100$和$F(x)$是统一的$[0,1]$。 对于给定的实现$F_n(x)$，最大偏差接近$x = 0.01$和$x = 0.99$除以$\sqrt{0.01\cdot 0.99} \approx 0.0995$，从而将小的绝对偏差放大约一个因子$10$。 相比之下，近$x = 0.5$，权重因子为$1/\sqrt{0.25} = 2$，这只是经典偏差的两倍。 所以，$K_n^\ast$对边界附近的偏差更加敏感$F(x)$，这正是经典 KS 由于二项式方差较小而最不敏感的地方。 

我们还可以近似$\Pr(\sqrt{n} K_n^\ast \le x)$使用蒙特卡罗模拟。 让$X_1, \ldots, X_n$独立吸取$F$, 计算$F_n$，然后计算$K_n^\ast$。 重复此过程$M$次产生的经验分布$\sqrt{n} K_n^\ast$并允许估计标准显着性水平的临界值。 

## 验证

 转变$F_n(x) \mapsto (F_n(x) - F(x))/\sqrt{F(x)(1-F(x))}$正确标准化二项式方差。 映射$t = \sin^2 \theta$确保方差对于所有的都是恒定的$\theta \in (0,\pi/2)$。 极限高斯过程参数遵循经验过程的经典 Donsker 定理，标准化桥上的上界是获得加权 KS 统计量的标准方法。 灵敏度接近$x \approx 0$或者$x \approx 1$与二项式方差在数量上一致，二项式方差在边界处较小，因此加权增加了检测尾部偏差的有效检验能力。 

## 注释

 可以使用替代的加权函数，例如$\bigl(F(x)(1-F(x))\bigr)^{-\alpha}$为了$0 < \alpha < 1$，提供经典 KS 之间的中间灵敏度（$\alpha = 0$) 和全面改进的 KS ($\alpha = 1/2$）。 多元类似物可以通过替换布朗桥来定义$B(t)$与相应的$s$维基弗过程。 该论证推广到任何连续的$F$， 假如$F$严格递增且可微，确保方差稳定变换得到明确定义。 

这样就完成了证明。 

∎
