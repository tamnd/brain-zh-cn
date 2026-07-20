---
title: "CF 103821H - FAT 序列"
description: "令$f$由降序二元决策图表示，并令$F(p)$表示专业化$p1=cdots=pn=p$下的可靠性多项式。"
date: "2026-07-02T08:23:45+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103821
codeforces_index: "H"
codeforces_contest_name: "(Aleppo + HAIST + SVU + Private) CPC 2022"
rating: 0
weight: 103821
solve_time_s: 127
verified: false
draft: false
---

[CF 103821H - FAT 序列](https://codeforces.com/problemset/problem/103821/H)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 7s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$f$用降序二元决策图表示，并令$F(p)$表示专业化下的可靠性多项式$p_1=\cdots=p_n=p$。 对于每个节点$v$的 BDD，让$F_v(p)$表示相应的子函数值$F(p)$通过限制根于的子 BDD 获得$v$。 对于接收器节点，定义由以下方式固定$F_{\bot}(p)=0$和$F_{\top}(p)=1$。 

对于分支节点$v$由某个变量标记$x_j$与 LO 继任者$v_0$和HI继任者$v_1$，相同概率下可靠性多项式的评估直接来自于对值的调节$x_j$，因为每个变量都等于$1$有概率$p$和$0$有概率$1-p$。 这产生$$F_v(p) = (1-p)F_{v_0}(p) + pF_{v_1}(p).$$这种递归与第 7.1.4 节中算法 C 的结构相匹配，其中计算在 BDD 上自下而上进行，每个节点值都是其后继值的组合。 

要计算导数，请区分上面的恒等式$p$。 写作$F_v'(p)=\frac{d}{dp}F_v(p)$给出$$F_v'(p)
= \frac{d}{dp}\bigl((1-p)F_{v_0}(p) + pF_{v_1}(p)\bigr).$$将乘积规则应用于每一项得出$$F_v'(p)
= -(F_{v_0}(p)) + (1-p)F_{v_0}'(p) + F_{v_1}(p) + pF_{v_1}'(p).$$重新排列术语会产生与相同的自下而上结构对齐的形式：$$F_v'(p)
= (1-p)F_{v_0}'(p) + pF_{v_1}'(p) + \bigl(F_{v_1}(p)-F_{v_0}(p)\bigr).$$这既表达了$F_v(p)$和$F_v'(p)$仅就两个后继而言，因此可以按照逆拓扑顺序在 BDD 的单次遍历中完成计算，与算法 C 完全相同，前提是每个节点仅在评估其 LO 和 HI 后继之后才进行处理。 

修改后的算法与每个节点关联$v$一对值$(F_v, D_v)$， 在哪里$D_v$代表$F_v'(p)$。 对于汇节点来说，$$(F_{\bot},D_{\bot})=(0,0), \qquad (F_{\top},D_{\top})=(1,0).$$对于每个分支节点$v$与继任者$v_0$和$v_1$，计算为$$F_v \leftarrow (1-p)F_{v_0} + pF_{v_1},$$

$$D_v \leftarrow (1-p)D_{v_0} + pD_{v_1} + (F_{v_1}-F_{v_0}).$$由于 BDD 是有序且非循环的，因此每个节点按照与递增变量索引一致的顺序精确评估一次，因此所有后继值在需要时都可用，这与算法 C 的评估规则相匹配。 

原始函数返回的值是根节点处的对$r$，即$F_r(p)$和$F_r'(p)$。 

这就完成了修改算法的构建和导数递推的论证。 ∎
