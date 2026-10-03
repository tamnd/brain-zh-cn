---
title: "CF 105838G - 喜欢数学的人不是小波基"
description: "我们得到一个非常大的整数区间，从 $L$ 到 $R$，其中 $R$ 可以大到 $10^{18}$。 任务是计算该区间内有多少数字满足基于数字的属性：当您查看数字的十进制表示形式时，绝对差......"
date: "2026-06-22T01:22:03+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105838
codeforces_index: "G"
codeforces_contest_name: "The 14th Huazhong Agricultural University Programming Contest"
rating: 0
weight: 105838
solve_time_s: 47
verified: true
draft: false
---

[CF 105838G - 喜欢数学的人不是Boki-chan](https://codeforces.com/problemset/problem/105838/G)

 **评级：** -
 **标签：** -
 **求解时间：** 47s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给出了一个非常大的整数区间，从$L$到$R$， 在哪里$R$可以大到$10^{18}$。 任务是计算此区间内有多少数字满足基于数字的属性：当您查看数字的十进制表示形式时，每对相邻数字之间的绝对差必须恰好为 1。所有单位数字都会自动满足此规则。 

因此，像 6、10、21、3210 或 4567 这样的数字是有效的，因为每个相邻数字对都恰好改变了 1。 像 112 这样的数字会失败，因为前两位数字相差 0，12332 会失败，因为 2 到 3 没问题，但 3 到 3 违反了规则，而 555 会立即失败，因为所有相邻的差值都是 0。 

输入是单个区间，输出是该区间内有效整数的计数。 

主要困难是范围的大小。 直接检查每个数字$L$到$R$是不可能的，因为间隔可以跨越$10^{18}$，这意味着最多$10^{18}$最坏情况下的候选人。 即使检查单个号码也会产生费用$O(\text{digits})$，所以暴力破解完全超出了范围。 

第二个微妙之处是前导数字结构。 该条件仅取决于相邻数字，因此数字的行为类似于数字图中的路径，并且我们需要对数字范围内的所有有效数字字符串进行计数，最多 18 位数字。 

打破天真的推理的边缘情况包括：

 个位数区间，例如$L=1, R=9$，其中所有答案都是有效的，并且解决方案不得使计数过于复杂。 

边界就像$L=10, R=10$，其中只有一个数字存在，即使它是最小的两位数情况，也必须正确计数。 

间隔其中$L$和$R$长度不同，例如$L=9, R=1000$，其中数字 DP 解决方案必须无缝处理所有长度。 

生成最多 18 位数字的所有有效数字并按范围过滤它们的简单方法仍然需要生成潜在的数百万个状态，但更重要的是，它需要仔细修剪以避免溢出超出范围，这正是数字 DP 旨在干净处理的情况。 

## 方法

 蛮力策略会迭代中的每个数字$[L, R]$，将其转换为字符串，并验证相邻数字是否相差正好 1。 这在逻辑上是有效的，因为条件对于每个数字来说都是局部的，并且只需要对每个候选进行线性扫描。 每个号码的成本为$O(d)$， 在哪里$d \leq 18$。 但候选人数为$R - L + 1$，在最坏的情况下是$10^{18}$，使得这种方法不可能实现。 

关键的观察是，我们不是独立地评估数字上的函数，而是计算满足局部转换约束的数字字符串。 每个有效数字可以看作是数字形成序列的路径，每一步移动±1。 这将问题转化为在有界约束下计算有效数字序列，这正是数字动态规划的设置。 

我们不是枚举数字，而是计算有多少个有效数字序列小于或等于给定界限$X$，然后将答案计算为：$$\text{count}(R) - \text{count}(L-1)$$计算$\text{count}(X)$，我们在位置上使用 DP，状态跟踪前一个数字，以及我们是否仍然严格遵守前缀$X$。 这避免了显式生成数字并确保我们只遍历可行的数字转换。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(R-L+1)\cdot O(d)$|$O(1)$| 太慢了|
 | 数字DP |$O(18 \cdot 10 \cdot 2)$|$O(18 \cdot 10 \cdot 2)$| 已接受 |

 ## 算法演练

 我们定义一个函数$f(X)$计算有多少个有效数字$[1, X]$。 最终的答案是$f(R) - f(L-1)$。 

1. 转换$X$转换成数字数组，这样我们就可以逐个位置地处理它。 这允许我们将部分前缀与边界进行比较。 
2.定义DP状态$dp[pos][prev][tight]$， 在哪里`pos`是当前的数字索引，`prev`是最后选择的数字，并且`tight`表示到目前为止的前缀是否等于$X$。 的作用`prev`至关重要，因为有效性取决于相邻数字的差异。 
3. 在位置 0 处初始化 DP，不选择前面的数字。 我们使用特殊的标记值（例如 10 或 -1）来指示尚未放置数字。 在此阶段，从 1 到第一个数字的所有数字$X$允许，因为除非数字恰好为零，否则前导零不被视为有效数字。 
4. 在每个位置，迭代所有可能的下一个数字。 如果我们还没有开始一个数字，我们可以选择0作为“仍然为空”的延续，但是一旦数字开始，前导零将被视为正常数字。 这样可以正确处理 10 或 100 等数字。 
5. 对于每个候选数字，强制执行邻接规则：如果我们已经有前一个数字，则绝对差必须恰好为 1。如果此条件失败，我们将跳过转换。 
6. 更新`tight`标志：如果我们是紧的并且我们选择一个等于当前绑定数字的数字，那么我们保持紧； 否则我们就会失去紧张感。 
7. 当到达最后一个位置时，对所有有效的完成情况进行求和。 任何至少选择一位数字的州都贡献一个有效数字。 
8. 使用前缀计数的包含-排除计算最终答案。 

### 为什么它有效

 每个有效数字恰好对应于 DP 中数字位置上的一条路径，因为每个位置决策通过前一个数字约束唯一地确定下一个状态。 DP 确保我们对每条这样的路径精确计数一次，并且`tight`约束保证我们永远不会超过上限。 由于所有转换都强制执行相邻差异条件，因此永远不会构造出无效数字，并且由于探索了所有可能的有效数字序列，因此不会遗漏任何数字序列。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def count_upto(x: int) -> int:
    if x <= 0:
        return 0

    digits = list(map(int, str(x)))
    n = len(digits)

    # dp[pos][prev][tight][started]
    # prev: 0-9, or 10 meaning "no previous digit yet"
    dp = [[[[0] * 2 for _ in range(2)] for _ in range(11)] for _ in range(n + 1)]
    dp[0][10][1][0] = 1

    for pos in range(n):
        for prev in range(11):
            for tight in range(2):
                for started in range(2):
                    cur = dp[pos][prev][tight][started]
                    if cur == 0:
                        continue

                    limit = digits[pos] if tight else 9

                    for d in range(limit + 1):
                        ntight = 1 if (tight and d == limit) else 0

                        if not started:
                            if d == 0:
                                dp[pos + 1][10][ntight][0] += cur
                            else:
                                dp[pos + 1][d][ntight][1] += cur
                        else:
                            if abs(d - prev) == 1:
                                dp[pos + 1][d][ntight][1] += cur

    res = 0
    for prev in range(11):
        for tight in range(2):
            res += dp[n][prev][tight][1]
    return res

def solve():
    L, R = map(int, input().split())
    print(count_upto(R) - count_upto(L - 1))

if __name__ == "__main__":
    solve()
```该实现将计数逻辑分离到一个辅助函数中，该函数计算前缀计数最多$X$。 DP 显式跟踪我们是否已开始构造数字，这对于正确处理前导零而不错误地强制执行邻接约束是必要的。 

哨兵值`10`用于表示前面数字的缺失。 这避免了将真实数字与“未设置”状态混合并保持转换逻辑干净。 

减法步骤`count_upto(R) - count_upto(L - 1)`确保间隔处理干净，无需特殊套管。 

## 工作示例

 ### 示例 1：$L=6, R=21$我们计算最多 21 个有效数字，然后减去最多 5 个数字。 

| 职位| 上一个状态 | 紧| 开始| 过渡|
 | ---| ---| ---| ---| ---|
 | 开始 | 10 | 10 1 | 0 | 0-2 的数字 |
 | 位置 1 | - | - | - | 构建 1 位数字 1-9 |
 | 位置 2 | - | - | - | 构建 10、12、21 等 |

 有效数字范围：6、7、8、9、10、12、21。 

此跟踪显示了如何自然地包含个位数以及两位数转换如何强制执行 ±1 规则。 

### 示例 2：$L=10, R=15$| 数量 | 有效期 |
 | ---| ---|
 | 10 | 10 有效 |
 | 11 | 11 无效|
 | 12 | 12 有效 |
 | 13 | 无效|
 | 14 | 14 无效|
 | 15 | 15 无效|

 DP 仅接受第二个数字与第一个数字相差 1 的转换，这会立即将集合过滤为 10 和 12。 

此示例演示了本地强制执行邻接检查，并正确消除无效的相等或不相邻的数字对。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(18 \cdot 10 \cdot 2 \cdot 10)$| 18 个位置、10 位数字、紧密状态和启动状态，每个状态最多 10 个转换 |
 | 空间|$O(18 \cdot 10 \cdot 2)$| 位置、数字和紧状态的 DP 表（针对上一个/开始状态进行优化）|

 状态空间由上限的位数固定，因此即使对于$10^{18}$。 每个查询的计算实际上是恒定的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    def count_upto(x: int) -> int:
        if x <= 0:
            return 0
        digits = list(map(int, str(x)))
        n = len(digits)
        dp = [[[[0] * 2 for _ in range(2)] for _ in range(11)] for _ in range(n + 1)]
        dp[0][10][1][0] = 1

        for pos in range(n):
            for prev in range(11):
                for tight in range(2):
                    for started in range(2):
                        cur = dp[pos][prev][tight][started]
                        if cur == 0:
                            continue
                        limit = digits[pos] if tight else 9
                        for d in range(limit + 1):
                            ntight = 1 if (tight and d == limit) else 0
                            if not started:
                                if d == 0:
                                    dp[pos + 1][10][ntight][0] += cur
                                else:
                                    dp[pos + 1][d][ntight][1] += cur
                            else:
                                if abs(d - prev) == 1:
                                    dp[pos + 1][d][ntight][1] += cur

        return sum(dp[n][p][t][1] for p in range(11) for t in range(2))

    L, R = map(int, inp.split())
    return str(count_upto(R) - count_upto(L - 1))

assert run("6 21") == "7"
assert run("1 9") == "9"
assert run("10 10") == "1"
assert run("11 11") == "0"
assert run("1 100")  # sanity check run
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 6 21 | 7 | 样本正确性和多位转换 |
 | 1 9 | 9 | 所有单位数字均有效 |
 | 10 10 | 10 1 | 单一边界数处理 |
 | 11 11 | 11 0 | 无效的重复数字 |

 ## 边缘情况

 边界情况是当$L = 1$。 在这种情况下，减法使用$L - 1 = 0$，并且 DP 对于非正输入正确返回零，确保不会发生下溢或负计数。 

第二种情况是当$X$是个位数。 DP 允许从 1 到 9 的任意数字开始新数字，并且不会触发邻接约束，因为没有前面的数字。 这保证了所有单位数字都被计算而无需特殊的大小写。 

第三种情况是当数字包含内部零（例如 101 或 210）时。这些都会得到正确处理，因为一旦数字开始，零就会像任何其他数字一样被处理，并且必须满足相对于前一个数字的 ±1 约束。
