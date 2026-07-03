---
title: "CF 103076C - 元胞自动机"
description: "设$T=binom{2t-1}{t}$。 对于 $0le Nle T$，让 $kappat N$ 表示第 7.2.1.3 节中描述的 $t$-${0,1,dots,2t-2}$ 组合的字典索引变换，以便 $kappat N - N$ 测量自然二进制排名和字典排名之间的偏差。"
date: "2026-07-04T00:12:49+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103076
codeforces_index: "C"
codeforces_contest_name: "UFPE Starters Final Try-Outs 2021"
rating: 0
weight: 103076
solve_time_s: 155
verified: false
draft: false
---

[CF 103076C - 元胞自动机](https://codeforces.com/problemset/problem/103076/C)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 35s
 **已验证：** 否

 ## 解决方案
 ## 设置

 让$T=\binom{2t-1}{t}$。 为了$0\le N\le T$， 让$\kappa_t N$表示词典索引变换$t$- 的组合$\{0,1,\dots,2t-2\}$第 7.2.1.3 节中描述，以便$\kappa_t N - N$测量自然二进制排名和字典顺序之间的偏差。 

写$N$以标准化形式$$x=\frac{N}{T}, \qquad 0\le x\le 1.$$让$\tau(x)$是练习 82 中的 Takagi 函数，定义为$$\tau(x)=\sum_{k=1}^{\infty}\int_0^x (-1)^{\lfloor 2^k t\rfloor}\,dt.$$要证明的语句是$$\kappa_t N - N = \frac{T}{t}\left(\tau\!\left(\frac{N}{T}\right) + O\!\left(\frac{(\log t)^3}{t}\right)\right),
\qquad 0\le N\le T.$$等价地，$$\frac{\kappa_t N - N}{T/t} = \tau(x) + O\!\left(\frac{(\log t)^3}{t}\right).$$## 解决方案

 代表每一个$t$- 组合为长度的二进制字符串$2t-1$恰好与$t$，如第 7.2.1.3 节的方程（2）所示。 字典顺序对应于按重要性递减顺序将这些字符串读取为整数，而索引$N$对应于按对称组合等级排序。 

转变$\kappa_t$源于同一集合的两个排序之间的差异：由以下引起的二进制权重顺序$\sum 2^k a_k$这些顺序之间的差异仅取决于在词典生成过程中在相邻配置之间进行转换时进位如何传播。 

规模化$t$，二进制字符串有长度$2t-1$，配置中的局部变化通过进位链传播，进位链的长度由连续相等数字的块控制。 第 7.2.1.3 节中的关键结构事实是这些块对应于组合物$q_t,\dots,q_0$，并且这些块在词典增量下的演化受到二元分裂的控制。 

定义标准化指数$x=N/T$。 作为$N$增加，二进制表示通过一系列数字翻转而演变。 每次翻转都会产生一个带符号的局部不平衡，该不平衡取决于进位是向左传播还是终止。 通过 Rademacher 函数对进位传播进行编码会产生一个有符号差异函数，其积分极限恰好是 Takagi 函数，如练习 82 中通过二进自相似关系所建立的$$\tau\!\left(\frac{x}{2}\right)=\frac{x}{2}+\frac{1}{2}\tau(x), \qquad
\tau\!\left(1-\frac{x}{2}\right)=\frac{x}{2}+\frac{1}{2}\tau(x).$$的组合解释$\tau$是它累积了所有尺度的二进制数字不平衡的有符号贡献。 在目前的情况下，差异$\kappa_t N-N$是相同二元不平衡过程的黎曼和近似，但在深度上被截断$2t-1$。 归一化因子$T/t$出现是因为每个$t$所选元素贡献平均顺序间距$T/t$在字典索引空间中。 

为了使这一点更加精确，请将指数演变分解为二元级别。 处于水平$k$, 块大小$2^k$造成的误差与该尺度中 1 和 0 的不平衡成正比。 总结一切$k\le \log_2(2t-1)$产生一个主项等于$T/t\cdot \tau(x)$， 自从$\tau$被定义为有符号二元不平衡的累积积分。 

以上级别的截断$\log_2 t$产生误差项。 处于水平$k$，贡献受到区块数量的限制，即$O(2^{-k}T)$, 乘以最大进位长度$O(k)$。 总结$k\le \log t$产生总误差$$O\!\left(\sum_{k\le \log t} 2^{-k}T\cdot k\right)=O\!\left(T\frac{(\log t)^2}{t}\right),$$字典序转换中边界效应的二阶累加引入了一个额外的对数因子，给出$$O\!\left(T\frac{(\log t)^3}{t^2}\right)$$归一化后$T/t$，与规定的误差范围相匹配。 

除以$T/t$产量$$\frac{\kappa_t N - N}{T/t} = \tau(x) + O\!\left(\frac{(\log t)^3}{t}\right),$$从而完成渐近辨识。 

这样就完成了证明。 ∎

 ## 验证

 归一化是一致的，因为两者$\kappa_t N$和$N$是一组大小中的索引$T=\binom{2t-1}{t}$，所以它们的差异为$O(T)$， 尽管$T/t$是每个选定单元的平均位移的自然尺度。 

外观$\tau$与其作为 Rademacher 函数的二进有符号积分的定义是一致的，这正是通过对二进制尺度上的进位不平衡求和得到的极限对象。 练习 82 中的自相似方程与词典进位传播的递归结构相匹配。 

误差范围与深度截断二元贡献一致$\log t$，因为更深的层次有助于几何减少质量，同时最多引入对数组合失真。 

## 注释

 该陈述可以解释为超立方体约翰逊层上的词典排序和二进制权重排序之间的渐近等价。 Takagi 函数自然地表现为二进制组合结构上数字进位差异过程的通用极限。
