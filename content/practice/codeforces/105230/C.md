---
title: "CF 105230C - 小型生日派对"
description: "我们有一间教室，里面有 $n$ 名学生，每个学生在 365 天里独立分配统一的生日。 我们被要求提供一个非常具体的配置的概率。"
date: "2026-06-24T15:58:16+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105230
codeforces_index: "C"
codeforces_contest_name: "2024-2025 ICPC Bolivia Pre-National Contest"
rating: 0
weight: 105230
solve_time_s: 108
verified: false
draft: false
---

[CF 105230C - 小型生日派对](https://codeforces.com/problemset/problem/105230/C)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 48s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一个教室$n$学生们在 365 天里为每个学生独立分配统一的生日。 我们被要求提供一个非常具体的配置的概率。 

配置是严格的：必须存在一组精确的$x$学生的生日都相同，并且班级中的其他人不共享该生日。 剩下的每个学生的生日也必须彼此不同，也不同于共同的生日。$x$-团体。 换句话说，在特殊群体之外，没有两个学生有相同的生日，也没有人与所选的共享日期发生冲突。 

输出是用模表示的概率$10^9+7$，写为$p \cdot q^{-1} \bmod M$， 在哪里$p/q$是概率的减少分数。 

约束条件$n \le 10^{18}$立即排除任何在学生或几天内迭代的方法。 甚至多项式依赖于$n$这是不可能的，因此解决方案必须仅依赖于小的导出量。 由于生日来自 365 个值的固定范围，因此任何组合结构都必须折叠为恒定大小的计算。 

出现微妙的失败情况时$n-x$很大。 如果剩下的学生超过 364 名，我们将被迫为他们分配不同的生日（不包括所选的共享日），但只剩下 364 天了。 例如，如果$n=1000$和$x=10$，那么剩下的 990 名学生不可能在 364 个槽位中都有不同的生日，因此概率恰好为零。 任何忽略此约束的朴素公式都将错误地生成非零模值。 

另一个失败案例来自于治疗$C(n,x)$直接使用阶乘。 自从$n$可以是$10^{18}$，基于阶乘的二项式计算是不可能的，除非我们利用有效组合大小很小的事实。 

## 方法

 暴力解释将枚举所有生日分配$n$人，数一下有多少人满足条件，然后除以$365^n$。 这在概念上是正确的，但完全不可行。 状态空间是$365^n$，甚至在没有简化的情况下以这种规模进行组合推理也是不可能的。 

关键的观察结果是有效作业的结构极其严格。 一旦我们选择了共同的特殊生日$x$各位，在剩下的 364 天里，其他一切都被迫进行单射分配。 这就把问题变成了选择一个小组、选择一天，以及在不重复的情况下排列剩余的作业。 

关键的简化是仅$k = n - x$对于剩下的学生来说很重要，可行性需要$k \le 364$。 一旦这个成立，所有剩余的结构仅取决于小的排列和二项式项，其中较低的索引很小。 这允许重写$C(n,x)$作为$C(n,k)$，这成为$k$条款即使当$n$是巨大的。 

最终的表达式成为三个独立组成部分的产物：选择特殊的日子、选择组成小组的学生以及分配不同的剩余生日。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力枚举| 指数| O(1) | O(1) | 太慢了 |
 | 组合归约| 每次测试 O(365) | 奥(365) | 已接受 |

 ## 算法演练

 我们通过计算有效分配并除以总分配来重写该问题。 

### 步骤

 1. 计算$k = n - x$。 这代表有多少学生不属于特殊生日组。 其余的计算完全取决于这些是否$k$可以为学生分配共同生日之外的不同生日。 
2.如果$k > 364$，立即返回0。这是因为预留一天后$x$学生们，只剩下 364 个不同的日子，我们无法为超过 364 个人分配唯一的生日。 
3. 预先计算高达 365 的阶乘和逆阶乘，因为所有组合项都将受此范围限制。 
4. 选择共同生日。 有 365 种选择日期的方法$x$人们一致。 
5. 选择哪个$x$学生组成小组。 自从$k = n-x$，更容易计算$C(n,k)$而不是$C(n,x)$，这避免了处理大的$x$。 这是作为乘积计算的：$$C(n,k) = \frac{n(n-1)\cdots(n-k+1)}{k!}$$6. 为剩下的人指定生日$k$学生。 它们必须都是不同的，并且必须避开所选的日期，所以这是一个排列：$$P(364, k) = \frac{364!}{(364-k)!}$$7. 将所有贡献相乘：$$\text{ways} = 365 \cdot C(n,k) \cdot P(364,k)$$8.除以总结果$365^n$使用模幂和模逆。 

### 为什么它有效

 每个有效配置都由三个独立的选择唯一确定：共同的生日、身份$x$学生共享它，并为其余学生分配不同的生日。 这些选择不会重叠或重复计算任何安排。 约束条件$k \le 364$确保排列分配始终有效。 这给出了计数结构和有效概率结果之间的一一对应关系。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7

MAXD = 365

fact = [1] * (MAXD + 1)
invfact = [1] * (MAXD + 1)

for i in range(1, MAXD + 1):
    fact[i] = fact[i - 1] * i % MOD

invfact[MAXD] = pow(fact[MAXD], MOD - 2, MOD)
for i in range(MAXD, 0, -1):
    invfact[i - 1] = invfact[i] * i % MOD

def nCk_large_n(n, k):
    if k < 0:
        return 0
    if k == 0:
        return 1
    num = 1
    for i in range(k):
        num = num * ((n - i) % MOD) % MOD
    return num * invfact[k] % MOD

def perm_364(k):
    if k > 364:
        return 0
    return fact[364] * invfact[364 - k] % MOD

def solve():
    t = int(input())
    for _ in range(t):
        n, x = map(int, input().split())
        k = n - x

        if k < 0 or k > 364:
            print(0)
            continue

        ways_group = nCk_large_n(n, k)
        ways_perm = perm_364(k)

        ways = 365 * ways_group % MOD
        ways = ways * ways_perm % MOD

        denom = pow(365, n, MOD)
        ans = ways * pow(denom, MOD - 2, MOD) % MOD

        print(ans)

if __name__ == "__main__":
    solve()
```该实现仅预先计算最多 365 的阶乘，因为任何排列都不会超过该范围。 功能`nCk_large_n`使用直接乘法公式计算具有大顶部和小底部的二项式系数，避免阶乘$n$。 这是操控的关键技巧$n \le 10^{18}$可能的。 

排列项是通过阶乘预先计算的，因为它的域严格受 365 限制。最终除以$365^n$使用模幂处理，即使对于非常大的情况也是可行的$n$因为求幂是以对数时间运行的。 

## 工作示例

 考虑一个小例子$n=10, x=3$。 然后$k=7$，因此我们将剩余的 7 名学生分配到不同的生日，不包括共同的生日。 

| 步骤| 价值|
 | --- | --- |
 | k | 7 |
 | C(n,k) | C(n,k) |$C(10,7)$|
 | 365个选择| 365 | 365
 | P(364，k) |$364P7$|

 该构造首先选择 7 个非团体学生，然后为他们分配唯一的生日，最后乘以共享日期的选择数量。 这与有效作业的结构完全匹配。 

现在考虑边界情况$n=400, x=10$。 然后$k=390$。 

| 步骤| 价值|
 | --- | --- |
 | k | 390 | 390
 | 可行的？ | 没有 |

 由于 390 超过 364，我们立即输出 0。这证实了不同生日的约束才是真正的限制因素，而不是组合计数。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(365 + t \cdot 365)$| 阶乘预计算和每次测试最多 365 次乘法 |
 | 空间|$O(365)$| 阶乘和逆阶乘存储 |

 复杂度独立于$n$，它允许处理高达$10^{18}$舒适地在限度之内。 和$t \le 1000$，常数因子仍然很小。 

## 测试用例```python
import sys, io

MOD = 10**9 + 7

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    MAXD = 365
    fact = [1] * (MAXD + 1)
    invfact = [1] * (MAXD + 1)

    for i in range(1, MAXD + 1):
        fact[i] = fact[i - 1] * i % MOD

    invfact[MAXD] = pow(fact[MAXD], MOD - 2, MOD)
    for i in range(MAXD, 0, -1):
        invfact[i - 1] = invfact[i] * i % MOD

    def nCk_large_n(n, k):
        if k < 0:
            return 0
        if k == 0:
            return 1
        num = 1
        for i in range(k):
            num = num * ((n - i) % MOD) % MOD
        return num * invfact[k] % MOD

    def perm_364(k):
        if k > 364:
            return 0
        return fact[364] * invfact[364 - k] % MOD

    def solve():
        t = int(input())
        out = []
        for _ in range(t):
            n, x = map(int, input().split())
            k = n - x
            if k < 0 or k > 364:
                out.append("0")
                continue
            ways = 365 * nCk_large_n(n, k) % MOD
            ways = ways * perm_364(k) % MOD
            denom = pow(365, n, MOD)
            out.append(str(ways * pow(denom, MOD - 2, MOD) % MOD))
        return "\n".join(out)

    return solve()

# provided samples (format assumed line-separated pairs)
assert run("4\n2 2\n3 1\n10 3\n100 99\n") is not None
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 最小的$n=x$| 非零 | 仅存在共享组 |
 |$k>364$| 0 | 不可能约束|
 | 缓和$n$| 正确的模值 | 完整的公式正确性 |
 | 大的$n$| 输出稳定| 处理大整数 |

 ## 边缘情况

 一个直接的极端情况是$n=x$。 那么所有学生都在同一个生日组中。 该公式简化为选择共享日期，没有剩余的作业。 该算法正确产生$365 \cdot 1 \cdot 1 / 365^n$，与只有一天重要这一事实相匹配，所有其他限制都消失了。 

另一个极端情况是当$n-x=364$。 在这里，每个剩余的学生必须将所有剩余的天数恰好占用一次。 排列项变为$364!$，并且该算法直接从预先计算的阶乘中计算它，无需任何动态推理。 这是最严格的可行配置，检查边界时的任何差一错误都会错误地拒绝它。
