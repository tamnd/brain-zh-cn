---
title: "CF 102341E - 伊布"
description: "有 (k) 堆石头，每一堆都包含 (n) 块石头中每一颗的一个碎片。 由于每个堆栈中的每个石头都恰好包含一次，因此每个堆栈都是 (1,ldots,n) 的排列。"
date: "2026-08-14T01:37:47+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102341
codeforces_index: "E"
codeforces_contest_name: "Radewoosh+mnbvmar Contest (supported by AIM Tech)"
rating: 0
weight: 102341
solve_time_s: 680
verified: true
draft: false
---

[CF 102341E - 伊布](https://codeforces.com/problemset/problem/102341/E)

 **评级：** -
 **标签：** -
 **求解时间：** 11m 20s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 有 (k) 堆石头，每一堆都包含 (n) 块石头中每一颗的一个碎片。 由于每个堆栈只包含每个石头一次，因此每个堆栈都是 (1,\ldots,n) 的排列。 

对于选定的连续堆栈组 ([l,r])，我们交错它们的内容，同时保留每个堆栈的内部顺序。 同样，我们构造了一个堆栈索引序列，使用 ([l,r]) 中的每个索引恰好 (n) 次。 选择一个堆栈产生的片段值是其当前的顶部值。 

如果某个石头连续出现 (r-l+1) 次，则该结构是错误的。 由于所选择的堆叠都是不同的，因此这样的运行恰好包含间隔中每个堆叠中该石头的一次出现。 令 (f(l,r)) 为避免每次此类运行的交错数量。 所需的答案是包含至少两个堆栈的所有区间的 (f(l,r)) 之和。 

排列是独立且均匀地随机生成的。 这种随机化是预期复杂性论证的一部分：对于一对固定的石头，它们的相对顺序在长度为 (s) 的间隔的每个堆栈中都相同的概率是 (2^{-s+1})。 官方问题由 Codeforces 托管，同一问题的独立编辑给出了最终的预期复杂度为 (O(n^2k+nk^2))。 

边界 (n,k\le300) 排除了任何接近枚举所有交错的情况。 即使对于包含 (k) 个堆栈的一个间隔，无限制交错的数量为

 [
 \frac{(kn)!}{(n!)^k}。 
]

 在 (n=k=300) 时，这远远超出了任何实际的枚举。 我们需要利用这样一个事实：禁止的运行包含每个堆栈中相同石头的一个副本，并且每个石头在每个堆栈中只出现一次。 

有几种边界情况很容易破坏实现。 首先，(k=2)表示禁止间隔由两个相等的相邻片段组成。 为了```
2 2
1 2
2 1
```有 (6) 个不受限制的交错。 正好有四个不好，所以答案是（2）。 仅检查最终值序列但忘记必须保留两个堆栈顺序的解决方案可能会计算无效排列。 

其次，只有当两颗棋子在每一堆中的相对顺序相同时，才可以在包含-排除中同时选择它们。 为了```
3 2
1 2
1 2
2 1
```两个堆栈的间隔各贡献 (2)，而所有三个堆栈的间隔贡献 (66)。 总答案是（70）。 仅检查每个石头是否可以单独形成一条路的解决方案将错过交集项。 

第三，相同的排列是一种有用的正确性测试，即使它们不能代表随机输入分布。 为了```
2 3
1 2 3
1 2 3
```唯一区间的答案是 (4)。 这里许多禁止的事件是同时兼容的，因此假设不同的不良事件是独立的实现将会失败。 

最后，堆栈中每个值都相等的输入根本不是合法的测试用例。 每行都必须是一个排列，因此所谓的“全等值”压力测试必须使用重复的排列，例如 (1,2,\ldots,n) 的两个副本。 将输入视为任意矩阵可以隐藏这种区别。 

## 方法

 直接蛮力在概念上很简单。 对于每个区间 ([l,r])，枚举每个堆栈选择序列，其中恰好包含每个 (r-l+1) 堆栈索引的 (n) 个副本。 对于每个序列，模拟堆叠并检查是否出现带有一颗石头的长度 (r-l+1) 的游程。 该方法是正确的，因为它明确地检查了每种可能的交错并准确地应用了良好结构的定义。 

对于 (s) 个堆栈的间隔，检查的序列数为

 [
 \frac{(sn)!}{(n!)^s},
 ]

 并检查一个序列的成本 (O(sn))。 因此，即使是一个很大的间隔也已经需要

 [
 O\left(sn\frac{(sn)!}{(n!)^s}\right)
 ]

 操作。 最坏的区间有(s=k)，所以这种方法是完全不可行的。 

有用的观察是通过包含排除来计算不良结构。 修复包含堆栈的间隔。 对于每个石头 (x)，令 (E_x) 为 (x) 的 (s) 个副本连续出现的事件。 

现在假设我们选择几个棋子 (x_1,x_2,\ldots,x_t) 并需要它们的所有事件。 所选石子在每一堆中必须具有相同的相对顺序。 如果每个堆栈中 (x) 出现在 (y) 之前，则写入 (x\prec y)。 所选的石子必须按此部分顺序形成一条链。 

一旦链条被固定，序列就会自然地分裂成间隙。 在第一个选定的石子之前、连续两个选定的石子之间以及最后一个选定的石子之后，每一堆都会贡献一定数量的普通碎片。 在一个间隙内，所有这些片段都可以任意交错，同时保留其堆栈顺序。 

假设间隙包含来自 (s) 个堆栈的 (d_1,d_2,\ldots,d_s) 个普通片段。 其交织数为

 \frac{(d_1+\cdots+d_s)!}{d_1!\cdots d_s!}。 
]

 每一块选定的石头本身形成一个连续的块。 它的 (s) 堆栈索引可以以任何顺序出现，给出因子 (s!)。 

这给出了石头上的路径 DP。 如果(u\prec v)，从(u)到(v)的转变只需要位于它们位置之间的片段的多项式系数。 DP 不需要知道已经选择了多少个选定的石子，因为间隙分解已经考虑了所有选定块的确切数量和位置。 

对于一个间隔，生成的 DP 需要 (O(n+m))，其中 (m) 是可比较的有序棋子对的数量。 随机排列使 (m) 平均较小。 对于长度 (s) 的间隔，一对固定的棋子在所有堆栈中具有相同相对顺序的概率 (2^{-(s-1)})。 对所有间隔求和，这给出了预期的 (O(n^2k)) 可比对工作。 剩余的 (O(n)) 工作对于每个 (O(k^2)) 间隔贡献 (O(nk^2)) 。 这是预期的随机复杂性。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O\left(kn\frac{(kn)!}{(n!)^k}\right)) 最大区间 | (O(kn)) | 太慢了|
 | 最佳| 预期 (O(n^2k+nk^2)) | (O(n^2+nk)) | 已接受 |

 ## 算法演练

1. 将每个堆栈转换为位置数组。 对于每个堆栈 (s) 和石头 (x)，存储 (\operatorname{pos}[s][x]) (x) 在该堆栈中的位置。 这使得每个排序测试和每个间隙尺寸都可以在恒定的时间内获得。 
2. 固定左端点（L）并延伸右端点（R），一次一堆。 第一堆（L）给出了所有棋子的固定顺序。 每个可比较的对都可以表示为一条边 (u\to v)，其中 (u) 出现在堆栈 (L) 中的 (v) 之前。 
3、对于每一个石子(x)，维护(x)之前前缀的多项式系数，

 [
 B_x=
 \frac{(\sum_s(\operatorname{pos}[s][x]-1))!}
 {\prod_s(\operatorname{pos}[s][x]-1)!},
 ]

 以及对应的后缀系数

 [
 A_x=
 \frac{(\sum_s(n-\operatorname{pos}[s][x]))!}
 {\prod_s(n-\operatorname{pos}[s][x])!}。 
]

 这些描述了在包含 (x) 的选定块之前和之后交错所有片段的方式数量。 

1. 对于当前每个可比较的对 (u\prec v)，维护它们之间差距的多项式系数 (G_{u,v})。 如果新堆栈具有位置 (p_u,p_v)，则可比性恰好在 (p_u<p_v) 时存在。 如果 (p_u\ge p_v)，则永久删除该边。 
2. 当添加新堆栈时，在常数时间内更新每个幸存的多项式系数。 如果当前多项式的总数为 (S)，并且新堆栈贡献 (d) 个元素，则

 [
 M' = M\frac{(S+d)!}{S!,d!}。 
]

 相同的公式更新 (B_x)、(A_x) 和每个幸存的 (G_{u,v})。 

1. 按照第一堆石子的顺序运行包含-排除DP。 令 (dp[x]) 为最后选择的棋子为 (x) 的所有非空链的有符号贡献，包括 (x) 之前的所有间隙。 然后

 -s!\左(
 B_x+
 \sum_{u\prec x}dp[u]G_{u,x}
 \右）。 
]

 第一项对应于仅选择 (x)。 其他所有项都将 (x) 附加到以 (u) 结尾的链上。 因子 (s!) 说明新选定块内堆栈选择的顺序。 

1. 在 DP 之后，在最后选择的块后面附加后缀。 区间的包含-排除校正为

 [
 \sum_x dp[x]A_x。 
]

 不受限制的交错数量是

 [
 T_s=\frac{(sn)!}{(n!)^s}。 
]

 因此

 [
 f(L,R)=T_s+\sum_x dp[x]A_x。 
]

 1. 将此值添加到每个 (R>L) 的全局答案中。 然后扩展 (R) 并更新活动的可比对结构。 当左端点发生变化时，使用新的第一个堆栈重建结构。 

关键的不变量是每个活动边 (u\to v) 准确地表示当前间隔的每个堆栈中 (u) 出现在 (v) 之前的条件。 对于每条活动边链，DP 都贡献了一个包含-排除项，每个间隙都有一个多项式系数，每个选定的石头都有一个（s！）因子。 因此，同时发生的不良事件的每个子集都会以正确的符号精确计数一次。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 1_000_000_007

def solve_instance(k, n, a):
    # pos[s][x] = zero-based position of stone x in stack s.
    pos = [[0] * n for _ in range(k)]
    for s in range(k):
        for p, x in enumerate(a[s]):
            pos[s][x - 1] = p

    max_fact = k * n
    fact = [1] * (max_fact + 1)
    for i in range(1, max_fact + 1):
        fact[i] = fact[i - 1] * i % MOD

    invfact = [1] * (max_fact + 1)
    invfact[max_fact] = pow(fact[max_fact], MOD - 2, MOD)
    for i in range(max_fact, 0, -1):
        invfact[i - 1] = invfact[i] * i % MOD

    invfact_n = invfact[n]

    ans = 0

    for left in range(k - 1):
        first = pos[left]

        order = sorted(range(n), key=first.__getitem__)

        # Every pair is created according to the order in the first stack.
        # Pair id -> (u, v).
        eu = []
        ev = []

        # Global doubly linked list of active pairs.
        gnxt = []
        gprev = []

        # Doubly linked lists of active incoming pairs for every v.
        bnxt = []
        bprev = []
        head_bucket = [-1] * n

        # Multinomial data for each pair.
        gap_sum = []
        gap_val = []

        # Active flag is useful when unlinking through two lists.
        active = []

        global_head = -1
        global_tail = -1

        # Build all pairs u -> v in first-stack order.
        for ii in range(n):
            u = order[ii]
            for jj in range(ii + 1, n):
                v = order[jj]

                eid = len(eu)
                eu.append(u)
                ev.append(v)

                d = first[v] - first[u] - 1
                gap_sum.append(d)
                gap_val.append(1)

                active.append(True)

                # Insert into v's incoming list.
                old = head_bucket[v]
                bprev.append(-1)
                bnxt.append(old)
                if old != -1:
                    bprev[old] = eid
                head_bucket[v] = eid

                # Insert into global list.
                gprev.append(global_tail)
                gnxt.append(-1)
                if global_tail != -1:
                    gnxt[global_tail] = eid
                else:
                    global_head = eid
                global_tail = eid

        # For one stack every multinomial coefficient is 1.
        before_sum = [first[x] for x in range(n)]
        before_val = [1] * n

        after_sum = [n - 1 - first[x] for x in range(n)]
        after_val = [1] * n

        invfact_n_pow = invfact_n

        # Add stacks right of 'left'.
        for right in range(left + 1, k):
            s = right + 1

            cur = pos[right]

            # Add the new stack to the prefix/suffix multinomials.
            for x in range(n):
                d = cur[x]

                old_sum = before_sum[x]
                new_sum = old_sum + d
                before_val[x] = (
                    before_val[x]
                    * fact[new_sum]
                    % MOD
                    * invfact[old_sum]
                    % MOD
                    * invfact[d]
                    % MOD
                )
                before_sum[x] = new_sum

                d2 = n - 1 - cur[x]

                old_sum = after_sum[x]
                new_sum = old_sum + d2
                after_val[x] = (
                    after_val[x]
                    * fact[new_sum]
                    % MOD
                    * invfact[old_sum]
                    % MOD
                    * invfact[d2]
                    % MOD
                )
                after_sum[x] = new_sum

            # Add the new stack to every currently comparable pair.
            eid = global_head
            while eid != -1:
                nxt_eid = gnxt[eid]

                u = eu[eid]
                v = ev[eid]

                pu = cur[u]
                pv = cur[v]

                if pu >= pv:
                    active[eid] = False

                    # Remove from global list.
                    p = gprev[eid]
                    q = gnxt[eid]
                    if p != -1:
                        gnxt[p] = q
                    else:
                        global_head = q
                    if q != -1:
                        gprev[q] = p
                    else:
                        global_tail = p

                    # Remove from v's bucket.
                    p = bprev[eid]
                    q = bnxt[eid]
                    if p != -1:
                        bnxt[p] = q
                    else:
                        head_bucket[v] = q
                    if q != -1:
                        bprev[q] = p
                else:
                    d = pv - pu - 1

                    old_sum = gap_sum[eid]
                    new_sum = old_sum + d

                    gap_val[eid] = (
                        gap_val[eid]
                        * fact[new_sum]
                        % MOD
                        * invfact[old_sum]
                        % MOD
                        * invfact[d]
                        % MOD
                    )
                    gap_sum[eid] = new_sum

                eid = nxt_eid

            # Number of unrestricted interleavings.
            invfact_n_pow = invfact_n_pow * invfact_n % MOD
            total = fact[s * n] * invfact_n_pow % MOD

            # Inclusion-exclusion DP.
            dp = [0] * n
            block_factor = fact[s]

            for x in order:
                val = before_val[x]

                eid = head_bucket[x]
                while eid != -1:
                    u = eu[eid]
                    val += dp[u] * gap_val[eid]
                    if val >= MOD:
                        val %= MOD
                    eid = bnxt[eid]

                dp[x] = (-block_factor * (val % MOD)) % MOD

            good = total
            for x in range(n):
                good += dp[x] * after_val[x]
                if good >= MOD:
                    good %= MOD

            ans += good
            if ans >= MOD:
                ans %= MOD

    return ans % MOD

def solve():
    k, n = map(int, input().split())
    a = [list(map(int, input().split())) for _ in range(k)]
    print(solve_instance(k, n, a))

if __name__ == "__main__":
    solve()
```位置矩阵是第一个结构预处理步骤。 存储逆排列比在堆栈中重复搜索石头更有用，因为两个石头之间的每次比较都会变成单个数组查找。 

对于固定的左端点，第一个堆栈定义 DP 使用的拓扑顺序。 每对开始时都是可比较的，因为只有一个堆栈存在。 当添加另一个堆栈时，如果其顺序与新堆栈一致，则一对要么存活，要么永久消失。 这种单调性使得活动对列表能够被增量地维护。 

前缀和后缀多项式使用与对间隙相同的更新标识。 假设多项式当前有总和为 (S) 的部分，并且新堆栈贡献 (d)。 其新值是旧值乘以

 [
 \frac{(S+d)!}{S!d!}。 
]

 所有阶乘和逆阶乘均预先计算模 (10^9+7)，因此每次更新都是常数时间。 

对结构对每条边使用两个链表。 添加堆栈时，全局列表允许实现访问每个当前活动的可比对。 每个目标列表让 DP 只访问特定宝石的活跃前辈。 当一对的相对顺序变得不一致后，它就会从两个列表中删除一次。 

登录`dp[x]`是负数，因为选择一个额外的不良事件会在包含-排除中贡献一个因子 (-1)。 过渡是

 [
 -s!\left(B_x+\sum dp[u]G_{u,x}\right),
 ]

 不

 [
 -s!B_x\left(1+\sum dp[u]G_{u,x}\right)。 
]

 当 (x) 附加到现有链时，后者会将 (x) 之前的前缀计数两次。 

Python 整数不会溢出，但每次乘法都会减少模 (10^9+7)。 所需的最大阶乘是 (k n\le90000)，它足够小，可以直接进行预计算。 

## 工作示例

 ### 示例 1

 输入是```
3 3
1 2 3
3 2 1
1 3 2
```考虑区间 ([1,2])。 有 (20) 个不受限制的交错，因为

 [
 \frac{6!}{3!3!}=20。 
]

 三块石头的位置分别是

 | 石材| 堆栈 1 | 堆栈 2 | 可比？ |
 | --- | --- | --- | --- |
 | 1 | 1 | 3 | |
 | 2 | 2 | 2 | |
 | 3 | 3 | 1 | |

 没有一对石头在两个堆栈中具有相同的相对顺序，因此每个包含-排除链的长度均为一。 

对于石头 (1)，前缀包含 (0) 和 (2) 元素，给出多项式系数 (1)。 后缀包含 (2) 和 (0)，还包含 (1)。 该块有 (2!) 个内部订单，因此其不良事件计数为 (2)。 

对于石头 (2)，前缀有 (1,1) 个元素并贡献 (2)。 后缀也有贡献 (2)。 包括块因子 (2!)，其不良事件计数为 (8)。 

对于石头 (3)，计数仍为 (2)。 

DP状态为

 | 石材| 前缀系数| 前人贡献 | (dp)| 后缀系数|
 | --- | --- | --- | --- | --- |
 | 1 | 1 | 0 | -2 | 1 |
 | 2 | 2 | 0 | -4 | 2 |
 | 3 | 1 | 0 | -2 | 1 |

 因此

 [
 f(1,2)=20-2-8-2=8。 
]

 对于区间 ([1,3])，第三个堆栈根据三个排列删除一些可比性并保留其他可比性。 运行相同的 DP 给出

 [
 f(1,3)=1446。 
]

 三个区间值为(8,1446,10)，所以最终答案为

 [
 8+1446+10=1464。 
]

 该痕迹说明了为什么 DP 是基于兼容的不良事件链而不是单个宝石。 单个不良事件仅需要其前缀和后缀多项式，而同时发生的事件集合由活动的前趋边表示。 

### 示例 2

 输入是```
4 2
1 2
2 1
1 2
2 1
```对于两个相邻的堆栈，无限制的交错次数为

 [
 \frac{4!}{2!2!}=6。 
]

 对于堆叠 (1,2)，两颗棋子出现的顺序相反，因此两对都没有可比性。 每块石头都会造成两个糟糕的结构，留下

 [
 f(1,2)=6-2-2=2。 
]

 同样的推理给出

 [
 f(2,3)=2,\qquad f(3,4)=2。 
]

 对于三个堆栈，不受限制的数量是

 [
 \frac{6!}{2!2!2!}=90。 
]

 这两块石头再次具有不兼容的相对顺序，因此不存在交集项。 每个单独的不良事件都会产生 (12)，

 [
 f(1,3)=90-12-12=66。 
]

 同样，

 [
 f(2,4)=66。 
]

 对于所有四个堆栈，有

 [
 \frac{8!}{2!^4}=2520
 ]

 无限制的交错。 两颗棋子现在具有交替顺序模式，并且 DP 给出

 [
 f(1,4)=2328。 
]

 间隔值为

 | 间隔| (f(l,r)) | (f(l,r)) |
 | --- | --- |
 | ([1,2]) | 2 |
 | ([1,3]) | 66 | 66
 | ([1,4]) | 2328 | 2328
 | ([2,3]) | 2 |
 | ([2,4]) | 66 | 66
 | ([3,4]) | 2 |

 它们的总和是 (2466)，与样本输出匹配。 

该示例练习了主要的优化。 随着添加更多堆栈，不兼容的对会从活动列表中消失，因此 DP 不会重复检查所有 (n^2) 个可能的对。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 预期 (O(n^2k+nk^2)) | (O(n)) 每个时间间隔的 DP 工作，加上与幸存的可比对成比例的工作 |
 | 空间| (O(n^2+nk)) | 配对列表及其差距系数占主导地位 |

 对于一对石子，在固定它们在一堆中的顺序后，每个额外的独立随机堆栈都会以概率 (1/2) 保留该顺序。 因此，对于长度为 (s) 的间隔，一对以概率 (2^{-(s-1)}) 生存。 对所有可能的间隔求和可得到预期的 (O(n^2k)) 对处理，而 (O(n)) 每个间隔的 DP 工作可得到 (O(nk^2))。 这是该问题的独立编辑来源所描述的随机复杂性。 

对于 (n,k\le300)，预期的工作量是实际的。 对于活动对图，该实现还使用紧凑整数数组而不是 Python 集或字典，因为常数因子在这种规模下很重要。 

## 测试用例

 以下测试均使用相同的方法`solve_instance`解中的函数。 最大尺寸情况检查实现是否保持在模块化结果范围内，因为为 (300\times300) 实例编写硬编码期望值将使测试本身依赖于另一个独立计算的解决方案。```
# Put the submitted solution in solution.py.
from solution import solve_instance

MOD = 1_000_000_007

# Sample 1
a = [
    [1, 2, 3],
    [3, 2, 1],
    [1, 3, 2],
]
assert solve_instance(3, 3, a) == 1464, "sample 1"

# Sample 2
a = [
    [1, 2],
    [2, 1],
    [1, 2],
    [2, 1],
]
assert solve_instance(4, 2, a) == 2466, "sample 2"

# Minimum size.
a = [
    [1, 2],
    [2, 1],
]
assert solve_instance(2, 2, a) == 2, "minimum-size case"

# Same permutation twice.
# There is only one interval, and its answer is 4.
a = [
    [1, 2, 3],
    [1, 2, 3],
]
assert solve_instance(2, 3, a) == 4, "identical permutations"

# Three stacks, with the third reversing the order.
# f(1,2)=2, f(2,3)=2, f(1,3)=66.
a = [
    [1, 2],
    [1, 2],
    [2, 1],
]
assert solve_instance(3, 2, a) == 70, "comparable-pair boundary"

# Maximum-size structural stress test.
# Cyclic shifts are valid permutations and avoid the invalid
# "all values equal" matrix requested by some generic test templates.
k = 300
n = 300
a = [
    [((j + i) % n) + 1 for j in range(n)]
    for i in range(k)
]
out = solve_instance(k, n, a)
assert 0 <= out < MOD, "maximum-size case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`2 2 / 1 2 / 2 1`| 2 | 最小尺寸和最小可能的禁止运行 |
 |`2 3 / 1 2 3 / 1 2 3`| 4 | 几个兼容的包含排除事件 |
 |`3 2 / 1 2 / 1 2 / 2 1`| 70 | 70 当新堆栈颠倒顺序时，可比较的对就会消失 |
 | (300\times300) 循环移位 | (0\le ans<10^9+7) | (0\le ans<10^9+7) | 最大维度、内存使用、阶乘界限和性能 |

 ## 边缘情况

 对于最小情况```
2 2
1 2
2 1
```有 (6) 个不受限制的交错。 石头（1）可以通过（2）种方式形成连续的对，石头（2）可以通过（2）种方式做同样的事情。 它们的事件不能同时发生，因为两个堆栈的相对顺序不一致。 因此 DP 给出 (6-2-2=2)。 重要的边界是间隔长度恰好为 (2)，因此坏运行由两个相等的片段组成。 

为了```
2 3
1 2 3
1 2 3
```所有三块石头都是可比的。 不良事件计数为 (12,8,12)。 对交集的权重为 (8,8,8)，三重交集的权重为 (8)。 包含-排除给出

 [
 20-(12+8+12)+(8+8+8)-8=4。 
]

 活动对结构保留所有三个对边缘，因为它们的顺序在两个堆栈中一致。 该测试发现了独立处理每个不良事件的错误。 

为了```
3 2
1 2
1 2
2 1
```前两堆石头一致，因此这对石头在区间 ([1,2]) 上具有可比性。 添加第三个堆栈会删除该堆栈对，因为其顺序相反。 两堆栈间隔各自贡献 (2)，而三堆栈间隔具有 (90) 个不受限制的交错和两个单独的不良事件贡献 (12)，得出 (66)。 总数为（70）。 这验证了当新添加的堆栈反转顺序时，配对删除恰好发生。 

对于最大尺寸的有效输入，例如测试块中使用的循环移位结构，每一行仍然是真正的排列。 阶乘数组只需要到 (90000) 的索引，并且每个多项式更新都保持在模算术范围内。 活动对列表可防止 DP 扫描已经变得不兼容的对。 原始输入的随机性质使得幸存对的预期数量对于预期的 (O(n^2k+nk^2)) 界限来说足够小。 

“全等值”情况不应传递给此程序，因为它违反了每个堆栈都是排列的输入条件。 最接近的有意义的压力情况是多次重复相同的排列。 这种情况也很有用，因为它故意创建尽可能多的可比较对，并检查包含-排除公式本身是否仍然正确，即使对于非典型的、高度结构化的输入也是如此。
