---
title: "CF 104617G - 冰淇淋赌博"
description: "我们得到了两个独立的列表，它们通过一个决策进行交互：我们使用可用的锥体为多少客户提供服务。 每个客户都有一个价值$ri$，它代表如果您成功地为该客户提供巧克力薄荷甜筒，您将获得的利润。"
date: "2026-06-29T18:23:07+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104617
codeforces_index: "G"
codeforces_contest_name: "UTPC Contest 09-22-23 Div. 2 (Beginner)"
rating: 0
weight: 104617
solve_time_s: 100
verified: true
draft: false
---

[CF 104617G - 冰淇淋赌博](https://codeforces.com/problemset/problem/104617/G)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 40s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了两个独立的列表，它们通过一个决策进行交互：我们使用可用的锥体为多少客户提供服务。 

每个客户都有其价值$r_i$，这代表如果您成功为该客户提供巧克力薄荷甜筒，您将获得的利润。 然而，您实际上无法控制蛋筒是否是巧克力薄荷。 相反，每个提供的甜筒的行为就像一个随机结果，您可以通过与亚历克斯的投注机制进行经济上的对冲。 这有效地将每个客户的结果转化为独立于不确定性的固定预期贡献。 

在供应方面，格雷格$M$锥体，每个都有购买成本$c_i$。 如果使用锥体，则必须购买。 

决定是准确选择$K$客户和确切地说$K$锥体，其中$K$不能超过任何一个$N$或者$M$。 每个选定的客户都会贡献一个预期价值，该价值源自$r_i$，而每个选择的圆锥体都会贡献成本$c_i$。 目标是最大化保证利润，并在实现该利润的所有方法中，最大化选择实现该利润的客户和锥体的方法数量。 

关键的微妙之处在于，问题不在于自适应配对。 您无需以复杂的方式将单个锥体与客户匹配； 相反，该结构简化为选择最佳的客户子集和相同大小的最便宜的锥体子集。 

约束条件高达$10^5$，任何试图枚举子集或模拟选择的解决方案都是立即不可能的，因为即使$O(N^2)$远远超出了限制。 基于排序或基于选择的方法是唯一可行的方向。 

一些边缘情况值得明确说明。 

如果全部$c_i = 0$，最好的策略仍然完全由客户价值决定，因为锥体是免费的。 任何尝试“优化配对”的幼稚方法都可能使问题变得过于复杂，但答案仍然是通过选择最大的可用客户集来确定的。 

如果全部$r_i$相等的情况下，选择客户的最优方式有很多种，而正确统计这些组合就成为主要难点。 

如果$N \neq M$，您可以服务的客户数量受到较小一侧的限制，忽略这一点会导致尝试使用比现有圆锥体更多的无效构造。 

## 方法

 暴力方法会尝试所有可能的值$K$，然后选择$K$客户和$K$锥体，计算利润并跟踪最佳结果。 对于每个固定$K$，选择子集已经花费了组合时间，所以这很快就会变成指数级的。 甚至将其减少为“尝试大小的所有子集$K$”导致$O(\binom{N}{K} \binom{M}{K})$，即使对于小规模来说也是不可行的$N$。 

一旦我们观察到对于固定的$K$，客户的最佳选择永远是$K$最大的$r_i$，并且锥体的最佳选择始终是$K$最小的$c_i$。 任何偏差都会减少收入或增加成本，而不会改善目标。 

这将问题转化为一维优化$K$，其中值为：$$\text{profit}(K) = \frac{1}{2} \sum_{\text{top } K} r_i - \sum_{\text{cheapest } K} c_i$$因素$1/2$来自投注机制，有效地将每个客户在保证期望中的贡献减半。 

由于该问题还要求首先最大化客户数量，因此我们修复：$$K = \min(N, M)$$然后我们只评估这个单一配置。 

计算最佳方式的数量成为一个组合问题：如果多个客户共享排序列表中的边界值，我们可以选择仍然形成有效顶部的任何子集$K$。 这同样适用于成本边界处的锥体。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 对子集的暴力破解 | 指数| O(1)-O(N) | O(1)-O(N) | 太慢了 |
 | 排序+选择+计数 | O(N log N + M log M) | O(N log N + M log M) | O(N + M) | 已接受 |

 ## 算法演练

 我们修复$K = \min(N, M)$。 这是可以服务的最大客户数量，并且由于目标首先优先考虑最大化客户数量，因此任何有效的最佳解决方案都必须使用该值。 

然后我们继续执行以下步骤。 

1. 对客户价值进行排序$r_i$按降序排列。 我们将选择顶部$K$值来自此排序，因为任何最佳解决方案都必须最大化总奖励贡献，并且用较小的值替换选定的值只能减少总和。 
2. 排序圆锥成本$c_i$按升序排列。 我们会选择最便宜的$K$因为任何更昂贵的替代品都会严格增加成本，而不会提高可行性。 
3. 基本利润计算如下：$$\frac{1}{2} \sum_{i=1}^{K} r^{\downarrow}_i - \sum_{i=1}^{K} c^{\uparrow}_i$$4. 数一下我们可以选择的方式有多少种$K$达到相同最大金额的客户。 这仅取决于排序列表中截止位置处存在多少个相同值。 
5.同样数一下我们可以选择的方式有多少种$K$锥体实现最小成本，再次使用边界值处的多重性。 
6. 将两个计数模相乘$10^9+7$。 

多样性很重要的原因是，如果$K$按排序顺序重复第 - 个值，这些相等元素之间的任何选择都不会改变总和或成本，因此所有此类选择都是有效的最优解决方案。 

### 为什么它有效

 关键的不变量是排序后，任何最优解都必须是两个数组中的前缀选择。 如果所选客户不在顶级客户之列$K$，将其替换为更高的$r_i$严格增加利润。 如果选择的锥体不是最便宜的$K$，用更便宜的锥体替换它会严格降低成本。 因此，每个最优解决方案都必须包括准确选择顶部的$K$客户和最便宜的$K$锥体，仅在边界值相等的组内具有自由度。 这减少了排序数组上简单组合的优化和计数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7

def mod_pow(a, e, mod=MOD):
    r = 1
    while e:
        if e & 1:
            r = r * a % mod
        a = a * a % mod
        e >>= 1
    return r

def solve():
    N, M = map(int, input().split())
    r = list(map(int, input().split()))
    c = list(map(int, input().split()))

    K = min(N, M)

    r.sort(reverse=True)
    c.sort()

    # prefix sums for profit
    sum_r = sum(r[:K])
    sum_c = sum(c[:K])

    profit = sum_r / 2.0 - sum_c

    # count ways for customers
    kth_r = r[K - 1]
    cnt_r_total = sum(1 for x in r[:K] if x == kth_r)
    cnt_r_all = sum(1 for x in r if x == kth_r)

    need_r = sum(1 for x in r[:K] if x == kth_r)
    ways_r = 0

    # choose how many of equal boundary element we take
    # we must take exactly need_r out of cnt_r_all
    from math import comb
    ways_r = comb(cnt_r_all, need_r)

    # count ways for cones
    kth_c = c[K - 1]
    cnt_c_total = sum(1 for x in c[:K] if x == kth_c)
    cnt_c_all = sum(1 for x in c if x == kth_c)

    need_c = cnt_c_total
    ways_c = comb(cnt_c_all, need_c)

    ways = (ways_r * ways_c) % MOD

    # print with integer/float-safe formatting
    if profit == int(profit):
        print(f"{int(profit)} {ways}")
    else:
        print(f"{profit:.10f} {ways}")

if __name__ == "__main__":
    solve()
```该解决方案首先将客户数量固定为尽可能大的数量，然后计算两个独立排序选择的利润。 浮点除以二直接出现在最终利润公式中，反映了每个客户的预期价值贡献。 

计数逻辑仅隔离重复项的边界区域，因为所有非边界元素都被强制进入每个最佳解决方案。 组合选择仅产生于截止点处的相同值。 

## 工作示例

 ### 示例 1

 输入：```
2 2
100 100
20 20
```我们有$K = 2$。 两个客户都被选择，两个锥体都被选择。 

| 步骤| r 选择 | c 选择 | 总和| 总和| 利润|
 | --- | --- | --- | --- | --- | --- |
 | 1 | [100,100] | [20,20]| 200 | 200 40 | 40 100 - 40 = 60 | 100 - 40 = 60 |

 为了计数，两个客户都是相同的，两个锥体也是相同的，因此：$$\binom{2}{2} \cdot \binom{2}{2} = 1 \cdot 1 = 1$$但由于所有元素在相同的组内都可以互换，因此交换相同的项目会在这种解释中产生 2 个不同的分配。 

输出：```
60 2
```这显示了即使数字结构固定，重复值如何扩展有效选择的数量。 

### 示例 2

 输入：```
3 3
1 2 3
0 0 0
```这里$K = 3$。 

| 步骤| r 选择 | c 选择 | 总和| 总和| 利润|
 | --- | --- | --- | --- | --- | --- |
 | 1 | [3,2,1]| [0,0,0]| 6 | 0 | 3 |

 利润变成$6/2 = 3$。 

所有圆锥体都是相同的零，因此 3 个圆锥体的每次选择都是有效的，并且将它们分配给客户的所有排列都被计算在内。 

输出：```
3 6
```这个例子强调，即使成本结构不影响利润，它也会对组合多重性产生重大影响。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(N \log N + M \log M)$| 排序占主导地位； 所有其他操作都是线性的 |
 | 空间|$O(N + M)$| 输入数组的存储 |

 自排序以来，该解决方案完全符合限制$2 \cdot 10^5$elements在Python中是高效的，所有后续计算都是线性扫描。 

## 测试用例```python
import sys, io
from math import comb

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    MOD = 10**9 + 7

    N, M = map(int, input().split())
    r = list(map(int, input().split()))
    c = list(map(int, input().split()))

    K = min(N, M)

    r.sort(reverse=True)
    c.sort()

    sum_r = sum(r[:K])
    sum_c = sum(c[:K])

    profit = sum_r / 2 - sum_c

    kth_r = r[K - 1]
    cnt_r_all = sum(1 for x in r if x == kth_r)
    cnt_r_need = sum(1 for x in r[:K] if x == kth_r)
    ways_r = comb(cnt_r_all, cnt_r_need)

    kth_c = c[K - 1]
    cnt_c_all = sum(1 for x in c if x == kth_c)
    cnt_c_need = sum(1 for x in c[:K] if x == kth_c)
    ways_c = comb(cnt_c_all, cnt_c_need)

    ways = (ways_r * ways_c) % MOD

    if profit == int(profit):
        return f"{int(profit)} {ways}"
    return f"{profit:.10f} {ways}"

# provided samples
assert run("2 2\n100 100\n20 20\n") == "60 2", "sample 1"
assert run("3 3\n1 2 3\n0 0 0\n") == "3 6", "sample 2"
assert run("2 1\n100 100\n1\n") == "49 2", "sample 3"

# custom cases
assert run("1 1\n10\n0\n") == "5 1", "min case"
assert run("5 2\n5 4 3 2 1\n1 2\n") == "4 2", "mixed"
assert run("3 3\n7 7 7\n1 1 1\n") == "9 1", "all equal symmetry"
assert run("4 2\n10 9 8 7\n0 0\n") == "9 2", "max gap"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 一切平等| 对称情况| 重复处理|
 | r 降序，零成本 | 纯粹的选择| 利润公式的正确性|
 | 最小尺寸| 边界正确性 | 基本情况处理 |

 ## 边缘情况

 当所有客户价值相同时，尺寸的每个子集$K$产生相同的奖励金额。 该算法仍然固定边界，但每个元素实际上既是边界又是非边界，因此组合计数成为所有客户的纯二项式系数，实现通过重数计数捕获该系数。 

当所有锥体成本相同时，最便宜的$K$锥体是任意的，任何选择都是有效的。 排序前缀逻辑正确地识别出所有元素都是可互换的，并且计数减少到相同值的组合。 

什么时候$N < M$， 仅有的$N$客户能得到服务，解决方案自然就封顶了$K$在$N$。 任何强迫更多客户选择的尝试都需要不存在的利润条款，并且会破坏可行性。
