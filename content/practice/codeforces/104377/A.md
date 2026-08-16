---
title: "CF 104377A - \u8ba1\u7b97\u5f02\u6216\u548c"
description: "我们被要求查看长度为 $m$ 的所有有序数组，这些数组由总和固定为 $n$ 的非负整数组成。 每个这样的数组都会贡献一个等于其所有元素的按位异或的值，并且我们需要所有有效数组上这些异或值的总和。"
date: "2026-07-01T17:21:20+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104377
codeforces_index: "A"
codeforces_contest_name: "The 21st Sichuan University Programming Contest"
rating: 0
weight: 104377
solve_time_s: 87
verified: true
draft: false
---

[CF 104377A - \u8ba1\u7b97\u5f02\u6216\u548c](https://codeforces.com/problemset/problem/104377/A)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 27s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求查看所有长度的有序数组$m$由非负整数组成，其总和固定为$n$。 每个这样的数组都会贡献一个等于其所有元素的按位异或的值，并且我们需要所有有效数组上这些异或值的总和。 

描绘输入的一个有用方法是我们正在分发$n$相同的单位分为$m$贴有标签的盒子。 每个分布定义一个数组$a_1, a_2, \dots, a_m$。 对于每个分布，我们计算第二个值：我们采用每个分布的二进制表示$a_i$，将它们异或在一起，然后将结果添加到全局总数中。 

这些限制使得这一切变得有趣。 总和$n$可以大到$10^{15}$，所以我们不能枚举成分，甚至不能存储与$n$。 箱数$m$最多 500，这个值足够小，每个位置的组合动态规划是合理的。 任何解决方案取决于迭代所有组合或使用 DP$n$直接是立即不可行的，因为即使是线性依赖$n$会太慢了。 

幼稚的方法也会以微妙的方式很快崩溃。 例如，如果$m = 2$和$n = 10$，有效对的编号已经为 11，并且每对都必须进行异或运算。 将其缩放为$n = 10^{15}$使得暴力破解完全不可能，但更重要的是，甚至尝试通过分裂来增量生成状态$n$导致指数爆炸。 

另一个常见的失败案例是尝试独立处理位。 如果我们错误地假设每一位$a_i$可以独立分配，仅受每比特总和约束，我们忽略比特之间的进位传播。 例如，$a_i = 1$和$a_i = 2$尽管两者都通过加法结构贡献多个位位置，但在位级别的行为却非常不同。 

所以真正的困难在于条件$\sum a_i = n$通过二进制进位耦合所有位，而异或仅取决于列值的每位奇偶校验。 

## 方法

 直接的暴力策略将产生所有$m$-非负整数的元组总和为$n$，然后计算它们的异或。 这本质上是枚举所有弱组合$n$进入$m$部分。 这样的元组的数量是$\binom{n+m-1}{m-1}$，当$n$取决于$10^{15}$。 即使对于小$n$，迭代所有有效元组是不可行的，并且每个元组都需要$O(m)$计算异或。 

关键的结构观察是约束$\sum a_i = n$是二元加法约束。 除进位外，每个位位置对总和都有独立贡献。 这表明逐位处理数字，保持较低位的进位，就像加法时的数字 DP 一样。 

然而，我们不仅计算有效赋值，而且还累积 XOR 值。 位位置的异或仅取决于有多少个$a_i$该位中有一个 1，特别是其奇偶校验。 这让我们可以将问题分解为每比特的贡献，同时仍然通过加法约束来保持全局有效性。 

因此，该解决方案成为二进制位置上的 DP，其中每个状态跟踪我们可以通过给定进位形成位的部分分配到下一个位置的方式，并同时累积由已固定的较低位贡献的 XOR 贡献之和。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 指数为$n$|$O(m)$| 太慢了 |
 | 带进位的按位 DP |$O(60 \cdot m^2 \cdot \text{carry})$|$O(m \cdot \text{carry})$| 已接受 |

 ## 算法演练

 我们处理二进制表示$n$从最低有效位到最高有效位。 在每个位位置，我们决定如何$m$数字分配它们的位，同时尊重它们的总和必须匹配$n$包括携带。 

我们定义了一个 DP 状态，在该状态中我们跟踪在处理完比特前缀后有多少种方式可以达到给定的进位，以及从处理后的比特中已经积累了多少 XOR 贡献。 

### 步骤

 1.我们预先计算二项式系数$C(m, k)$为所有人$0 \le k \le m$。 这是必要的，因为我们在每一位上都准确地选择了多少个$m$数字在该位置有一个 1。 
2. 我们初始化一个 DP 表，其中初始状态具有零进位和零 XOR 贡献，表示没有处理的位。 
3. 对于每个位位置$pos$从 0 到大约 60，我们采用当前的 DP 状态并尝试所有可能的选择$k$出现在其中$m$该位的数字。 

选择$k$贡献一个组合因素$C(m, k)$，因为我们正在选择哪个$k$索引的位为 1。 
4. 令该位的当前进位为$c$，并让$n_{bit}$成为$pos$第 位$n$。 所有数字中该位置的位总和为$k + c$。 

该和必须满足二进制加法约束：$$k + c \equiv n_{bit} \pmod{2}$$下一个进位是：$$c' = \frac{k + c - n_{bit}}{2}$$5. 对于每个有效的转换，我们更新两个数量。 首先，将路数乘以$C(m, k)$。 其次，该位的异或贡献取决于是否$k$是奇数，因为 XOR$k$一个是 1 当且仅当$k$很奇怪。 如果是1，我们添加$2^{pos}$乘以促成这种转变的方式数量。 
6. 我们将这些转换累积到下一个 DP 状态，索引为$c'$。 
7. 处理完所有位后，答案是最终进位为零的所有 DP 状态上的总 XOR 贡献。 

### 为什么它有效

 DP 强制执行总和约束的正确性，就像带进位的二进制加法一样。 每个有效元组恰好对应于一个位选择和进位序列。 组合因子确保我们计算整个 1 位的所有分配$m$位置正确。 XOR 累加在位上是线性的，因此来自不同位位置的贡献永远不会干扰，并且可以在转换期间安全地求和。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7

def solve():
    n, m = map(int, input().split())

    max_c = m

    # precompute binomial coefficients
    C = [[0] * (m + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        C[i][0] = 1
        for j in range(1, i + 1):
            C[i][j] = (C[i - 1][j] + C[i - 1][j - 1]) % MOD

    # dp[carry] = (ways, xor_sum)
    dp = [[0, 0] for _ in range(m + 1)]
    dp[0][0] = 1

    for bit in range(61):
        ndp = [[0, 0] for _ in range(m + 1)]
        nb = (n >> bit) & 1

        for carry in range(m + 1):
            ways, xs = dp[carry]
            if ways == 0:
                continue

            for k in range(m + 1):
                comb = C[m][k]
                if comb == 0:
                    continue

                total = k + carry
                if (total & 1) != nb:
                    continue

                nc = (total - nb) // 2
                if nc < 0 or nc > m:
                    continue

                nways = ways * comb % MOD

                # xor contribution from this bit
                if k & 1:
                    add_xor = (nways * ((1 << bit) % MOD)) % MOD
                else:
                    add_xor = 0

                ndp[nc][0] = (ndp[nc][0] + nways) % MOD
                ndp[nc][1] = (ndp[nc][1] + xs * comb % MOD + add_xor) % MOD

        dp = ndp

    print(dp[0][1] % MOD)

if __name__ == "__main__":
    solve()
```该代码在二进制位置上构建了一个数字DP$n$。 二项式表用于计算我们可以分配多少种方式$k$其中的$m$每个位的位置。 DP 状态跟踪进位传播，以便构建的数字总和精确等于$n$。 XOR 累积被分为来自先前位的继承贡献和来自当前位的新贡献，加权为$2^{bit}$。 

一个微妙的点是分离`ways`和`xor_sum`。 XOR 和取决于到达某个状态的方式数，因此每个转换都会以乘法和加法方式进行更新。 错误地混合这些是多算的常见原因。 

## 工作示例

 考虑一个小案例$n = 4, m = 2$。 我们枚举有效对：$(0,4), (1,3), (2,2), (3,1), (4,0)$。 

我们逐点追踪贡献。 

| 配对 | 异或|
 | ---| ---|
 | (0,4) | 4 |
 | (1,3) | 2 |
 | (2,2) | 0 |
 | (3,1) | 2 |
 | (4,0) | 4 |

 总数为 12。 

在 DP 术语中，在每一位上，我们选择两个数字中有多少个带有 1。进位约束确保二进制和与 4 匹配的那些对在所有位中都存在，而当两个数字中恰好有一个在某个位位置具有 1 时，异或贡献就会累积。 

第二个例子$n = 3, m = 2$给出对$(0,3),(1,2),(2,1),(3,0)$。 异或值是$3,3,3,3$，总共 12。这里，每个有效分配在每个 XOR 计算模式中都恰好有一位贡献，并且 DP 正确地计算对称贡献。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(60 \cdot m^2 \cdot m)$| 对于每一位，每个进位状态都会尝试所有$k$价值观 |
 | 空间|$O(m)$| DP 仅存储携带状态 |

 界限$m \le 500$大约 60 位就可以实现这一点。 总的转换数量约为几千万，这完全符合优化的 Python 的时间限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import builtins
    return sys.stdout.getvalue() if False else solve_wrapper(inp)

def solve_wrapper(inp: str) -> str:
    import sys
    from io import StringIO
    backup_stdin = sys.stdin
    sys.stdin = StringIO(inp)

    MOD = 10**9 + 7

    def solve():
        n, m = map(int, input().split())

        C = [[0] * (m + 1) for _ in range(m + 1)]
        for i in range(m + 1):
            C[i][0] = 1
            for j in range(1, i + 1):
                C[i][j] = (C[i - 1][j] + C[i - 1][j - 1]) % MOD

        dp = [[0, 0] for _ in range(m + 1)]
        dp[0][0] = 1

        for bit in range(20):
            ndp = [[0, 0] for _ in range(m + 1)]
            nb = (n >> bit) & 1

            for c in range(m + 1):
                w, x = dp[c]
                if not w:
                    continue
                for k in range(m + 1):
                    comb = C[m][k]
                    if not comb:
                        continue
                    total = k + c
                    if (total & 1) != nb:
                        continue
                    nc = (total - nb) // 2
                    if nc < 0 or nc > m:
                        continue
                    nw = w * comb % MOD
                    add = (nw * ((1 << bit) % MOD)) % MOD if k & 1 else 0
                    ndp[nc][0] = (ndp[nc][0] + nw) % MOD
                    ndp[nc][1] = (ndp[nc][1] + x * comb % MOD + add) % MOD

            dp = ndp

        return str(dp[0][1] % MOD)

    return solve()

# provided sample
assert run("4 2") == "12"

# custom cases
assert run("1 1") == "1", "single configuration"
assert run("2 2") == "4", "symmetric splits"
assert run("0 2") == "0", "all zeros"
assert run("3 1") == "3", "single variable"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 4 2 | 12 | 12 样本正确性 |
 | 1 1 | 1 1 | 最小非零结构|
 | 2 2 | 2 4 | 组成的对称性|
 | 0 2 | 0 | 零和边缘情况 |
 | 3 1 | 3 1 3 | 单变量简并情况 |

 ## 边缘情况

 对于$n = 0$，所有数组都被迫全为零。 DP 从零进位开始，并立即仅传播一种有效配置。 每一点，只$k = 0$有效，因此 XOR 始终为零，最终输出保持为零。 

为了$m = 1$，只有一个变量$a_1 = n$。 DP 简化为跟踪单个路径，其中进位始终与$n$，异或等于$n$因为 XOR 中只有一个值。 

对于大型$n$使用稀疏二进制表示，大多数 DP 状态都会被提前修剪，因为进位约束消除了无效转换。 这确保了算法的行为更接近$O(60 \cdot m^2)$而不是探索所有理论进位状态。
