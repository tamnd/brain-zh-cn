---
title: "CF 103824F - \u6298\u78e8\u738b（硬版）"
description: "令 $v$ 为 $f$ 的降序 BDD 的节点，并令 $Fv(p)$ 表示在特化 $p1=cdots=pn=p$ 下以 $v$ 表示的子函数的可靠性多项式。 令 $F'v(p)$ 表示其相对于 $p$ 的导数。"
date: "2026-07-02T08:19:15+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103824
codeforces_index: "F"
codeforces_contest_name: "2022 Summer Camp of XTU Qualifying Round"
rating: 0
weight: 103824
solve_time_s: 55
verified: false
draft: false
---

[CF 103824F - \u6298\u78e8\u738b（硬版）](https://codeforces.com/problemset/problem/103824/F)

 **评级：** -
 **标签：** -
 **求解时间：** 55s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$v$是降序 BDD 的一个节点$f$，并让$F_v(p)$表示子函数的可靠性多项式$v$专业化下$p_1=\cdots=p_n=p$。 让$F'_v(p)$表示它的导数$p$。 

对于汇聚节点，这些值是通过可靠性多项式的定义来固定的。 如果$v=\bot$， 然后$F_v(p)=0$和$F'_v(p)=0$。 如果$v=\top$， 然后$F_v(p)=1$和$F'_v(p)=0$。 

让$v$是一个由变量标记的分支节点$x_k$后继者少$v_L$和高位继承人$v_H$。 可靠性多项式满足从算法 C 中的定义继承的分解，因为条件为$x_k=0$贡献重量$1-p$并调节$x_k=1$贡献重量$p$。 所以$$F_v(p)=(1-p)F_{v_L}(p)+pF_{v_H}(p).$$区分这个身份$p$产量$$F'_v(p)=-(F_{v_L}(p))+(1-p)F'_{v_L}(p)+F_{v_H}(p)+pF'_{v_H}(p).$$一旦后继值已知，这两个递归就确定了每个节点的可靠性值及其导数。 

直接评估在 BDD 有向无环图的后序遍历中进行。 每个节点计算一次，因为降序 BDD 识别同构子函数，因此共享保证了两者$F_v(p)$和$F'_v(p)$对于从根到达的每个节点都一致地定义。 

计算分配给每个节点$v$一对数字$(F_v, F'_v)$根据复发情况。 在水槽处，这对是$(0,0)$或者$(1,0)$。 在分支节点处，该对是由已经计算出的对形成的$v_L$和$v_H$使用上面的公式。 由于每个节点恰好有两个传出弧，并且图在变量排序下是非循环的，因此这种自下而上的传播在解决所有依赖关系后到达根。 

价值$F(p)$对于原始布尔函数$f$是$F_r(p)$在根节点$r$，其导数为$F'_r(p)$。 

这就完成了修改算法 C 的构建，该算法同时评估了可靠性多项式$p$及其衍生物。 ∎
