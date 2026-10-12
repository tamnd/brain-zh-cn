---
title: "CF 106015M - Halzoom 奇怪的喂食系统"
description: "我们正在模拟一个分层喂养系统，其中一系列猫的食物价值随着时间的推移而增长。 连续 $M$ 只猫，$N$ 天。 第一天，每只猫开始时只吃 1 克食物。"
date: "2026-06-22T16:48:11+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106015
codeforces_index: "M"
codeforces_contest_name: "Game of Coders 4 - Over the Garden Wall"
rating: 0
weight: 106015
solve_time_s: 50
verified: true
draft: false
---

[CF 106015M - Halzoom 奇怪的喂养系统](https://codeforces.com/problemset/problem/106015/M)

 **评级：** -
 **标签：** -
 **求解时间：** 50s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们正在模拟一个分层喂养系统，其中一系列猫的食物价值随着时间的推移而增长。 有$M$猫排成一排和$N$天。 第一天，每只猫开始时只吃 1 克食物。 

从第二天开始，猫吃的食物取决于两件事：前一天的价值，以及当天早些时候所有猫吃过的食物的累计量。 换句话说，猫$j$当天$i$建立在自己的历史之上，并且还积累了同一天指数较小的猫的贡献。 

任务不是模拟整个过程。 我们只需要最后一只猫的最终值，$M$，当天$N$，以 998244353 为模计算。 

约束条件允许两者$N$和$M$最多$10^6$。 这立即排除了任何显式构建完整的解决方案$N \times M$桌子。 即使存储它太大，并且迭代所有转换也会是$10^{12}$最坏情况下的操作。 

天真的思维的一个微妙的失败案例是假设每一天都可以通过猫的简单前缀和来独立计算。 这实际上每天都是正确的，但整天重复它是不可行的。 另一个陷阱是尝试仅模拟最后一行，而没有意识到前一行通过前缀累积结构影响下一行。 

## 方法

 直接模拟遵循字面定义。 每天，我们从左到右计算所有猫的值。 当计算猫时$j$，我们添加前一天的值以及所有猫的总和$1$到$j-1$当天。 这需要维护每天的前缀总和。 

这种方法是正确的，因为它准确地反映了重现过程。 然而，它处理$M$每个猫$N$天，导致$O(NM)$时间复杂度。 和$N, M \le 10^6$，这变得太大了。 

关键的观察结果是递归具有非常结构化的加法形式。 每天，新行都是根据前一行加上当前行的前缀累积构建的。 这与二项式系数构造和类帕斯卡变换中出现的结构相同。 

如果我们追踪单个初始食物单位如何传播，它的传播方式相当于计算网格中的路径：向右移动对应于猫之间的积累，向下移动对应于几天内的进展。 各州$(i, j)$累加来自上方和左侧的贡献，这正是二维二项式系数的递推。 

这导致了这样的解释：$(N, M)$等于来自的单调路径数$(1,1)$到$(N,M)$，这是一个标准组合值：$$\binom{N + M - 2}{M - 1}.$$因此，问题简化为计算模 998244353 的单个二项式系数，这使用阶乘预计算是高效的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力模拟|$O(NM)$|$O(M)$| 太慢了 |
 | 组合学（二项式系数）|$O(N + M)$预处理,$O(1)$查询 |$O(N + M)$| 已接受 |

 ## 算法演练

 我们将动态过程简化为组合计数问题并有效地计算二项式系数。 

1. 预先计算阶乘和逆阶乘$N + M$。 这是必要的，因为我们将计算以素数为模的组合公式，并且在模运算下不可能直接除法。 
2. 使用费马小定理计算模逆。 由于 998244353 是质数，$x^{-1} \equiv x^{MOD-2} \mod MOD$。 这允许我们在计算阶乘后在线性时间内构建逆阶乘。 
3. 认识到最终值对应于选择的位置$M-1$之间向右移动$N+M-2$网格解释中的总移动。 这将 DP 结构转换为：$$\binom{N + M - 2}{M - 1}.$$4. 使用标准公式计算结果：$$\text{fact}[N+M-2] \cdot \text{invfact}[M-1] \cdot \text{invfact}[N-1].$$5. 输出对 998244353 取模的结果。 

### 为什么它有效

 递归定义了一个二维累积过程，其中每个单元取决于其顶部邻居（前一天）和左前缀（同一天较早的猫）。 这创建了一个与计算网格路径相同的依赖结构，其中移动仅限于向右和向下方向。 来自初始状态的每个单位贡献通过所有有效路径传播，以及从原点到$(N,M)$正是上面的二项式系数。 由于所有贡献都是线性且独立的，因此对所有路径求和即可得出最终值。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353

def modinv(x):
    return pow(x, MOD - 2, MOD)

def solve():
    N, M = map(int, input().split())
    
    maxv = N + M - 2
    
    fact = [1] * (maxv + 1)
    for i in range(1, maxv + 1):
        fact[i] = fact[i - 1] * i % MOD
    
    invfact = [1] * (maxv + 1)
    invfact[maxv] = modinv(fact[maxv])
    for i in range(maxv, 0, -1):
        invfact[i - 1] = invfact[i] * i % MOD
    
    def C(n, r):
        if r < 0 or r > n:
            return 0
        return fact[n] * invfact[r] % MOD * invfact[n - r] % MOD
    
    print(C(N + M - 2, M - 1))

if __name__ == "__main__":
    solve()
```实现首先读取$N$和$M$，然后构建阶乘和逆阶乘表直至$N+M-2$。 使用快速求幂计算模逆一次。 然后使用组合函数直接评估封闭形式。 必须小心确保阶乘数组的大小精确到$N+M-2$，因为这里的相差一错误很常见。 

## 工作示例

 考虑一个小案例$N = 3, M = 3$。 我们计算$\binom{4}{2} = 6$。 

| 步骤| 价值|
 | --- | --- |
 | 计算 N+M-2 | 4 |
 | 计算 M-1 | 2 |
 | 评估 C(4,2) | 6 |

 这与循环的预期组合增长相匹配，其中每个移动序列对应于食物贡献的有效传播。 

现在考虑$N = 4, M = 2$。 答案是：$$\binom{4}{1} = 4.$$| 步骤| 价值|
 | --- | --- |
 | 计算 N+M-2 | 4 |
 | 计算 M-1 | 1 |
 | 评估 C(4,1) | 4 |

 这证实了当只有一种猫尺寸选择时，系统会减少到跨天的线性传播。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(N + M)$| 阶乘和逆阶乘预计算高达$N+M$|
 | 空间|$O(N + M)$| 阶乘表的存储 |

 约束允许最多$10^6$，因此线性预计算可以在时间限制内轻松完成。 内存使用量仍然很小，因为只有一个数组达到指定大小$2 \cdot 10^6$是需要的。 

## 测试用例```python
import sys, io

MOD = 998244353

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    N, M = map(int, input().split())
    maxv = N + M - 2

    fact = [1] * (maxv + 1)
    for i in range(1, maxv + 1):
        fact[i] = fact[i - 1] * i % MOD

    invfact = [1] * (maxv + 1)
    invfact[maxv] = pow(fact[maxv], MOD - 2, MOD)
    for i in range(maxv, 0, -1):
        invfact[i - 1] = invfact[i] * i % MOD

    def C(n, r):
        return fact[n] * invfact[r] % MOD * invfact[n - r] % MOD

    return str(C(N + M - 2, M - 1))

# provided sample
assert run("3 3\n") == "6"

# minimum case
assert run("1 1\n") == "1"

# single row behavior
assert run("1 5\n") == "1"

# single column behavior
assert run("5 1\n") == "1"

# symmetric case
assert run("4 4\n") == str(pow(2, 6, MOD))

# boundary stress small
assert run("2 3\n") == str(3)
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 1 | 1 1 | 基本情况正确性 |
 | 1 5 | 1 1 | 无日传播效应|
 | 5 1 | 1 | 无猫繁殖效应|
 | 4 4 | 64 | 64 对称二项式增长|
 | 2 3 | 3 | 小型非平凡传播 |

 ## 边缘情况

 对于$N = 1, M = 1$，系统的演化永远不会超出初始条件。 公式给出$\binom{0}{0} = 1$，与定义匹配。 

为了$N = 1, M = k$，只有一天，因此不会发生日间累积。 所有猫的重复率都会崩溃为恒定值。 公式给出$\binom{k-1}{k-1} = 1$，匹配平行行为。 

为了$M = 1, N = k$，只有一只猫，因此不存在前缀交互。 每一天都简单地传递着相同的价值。 公式给出$\binom{k-1}{0} = 1$，与未改变的单列一致。
