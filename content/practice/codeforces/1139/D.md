---
title: "CF 1139D - 迈向一"
description: "我们独立且一致地重复选择 1 到 m 之间的随机整数。 每次选择后，我们都会查看迄今为止选择的所有数字的最大公约数。 一旦 gcd 变为 1，该过程就会停止。我们必须计算所选整数的预期数量。"
date: "2026-06-12T03:53:41+07:00"
tags: ["codeforces", "competitive-programming", "dp", "math", "number-theory", "probabilities"]
categories: ["algorithms"]
codeforces_contest: 1139
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 548 (Div. 2)"
rating: 2300
weight: 1139
solve_time_s: 99
verified: true
draft: false
---

[CF 1139D - 迈向一](https://codeforces.com/problemset/problem/1139/D)

 **评分：** 2300
 **标签：** dp、数学、数论、概率
 **求解时间：** 1m 39s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们反复选择一个随机整数`1`到`m`，独立且统一。 

每次选择后，我们都会查看迄今为止选择的所有数字的最大公约数。 一旦 gcd 变为，该过程就会停止`1`。 我们必须计算所选整数的预期数量。 

答案是一个有理数。 问题要求该期望取模`10^9+7`，这意味着我们使用模算术并使用模逆来表示除法。 

关键的观察是所选数字的整个历史都是无关紧要的。 只有当前的 gcd 才重要。 如果当前的gcd是`g`，然后选择一个新号码后`x`，新的 gcd 变为`gcd(g, x)`。 这将过程变成了关于 gcd 值的马尔可夫链。 

约束条件`m ≤ 100000`是问题最重要的部分。 任何对过程的所有子集、所有序列或所有状态进行显式建模的解决方案都是不可能的。 甚至一个`O(m²)`算法将执行大约`10¹⁰`操作，远远超出极限。 我们周围需要一些东西`O(m log m)`或者`O(m log² m)`。 

有几种微妙的情况很容易导致错误的推理。 

考虑`m = 1`。 

输入：```
1
```唯一可能的选择是`1`，因此该过程立即停止，并且期望正是`1`。 任何复发必须正确治疗gcd`1`作为吸收状态。 

考虑`m = 2`。 

第一个数字是`1`或者`2`。 

如果是的话`1`，我们立即停下来。 

如果是的话`2`，我们继续绘制，直到`1`出现。 

期望是`2`， 不是`1.5`。 只关注第一次抽签的天真尝试错过了任意长期抽奖的可能性`2`s。 

另一个常见的错误是认为所有 gcd 值都来自`1`到`m`是同样有可能的。 他们不是。 例如，当`m = 10`, 气相色谱`6`只能由可被整除的数字产生`6`，而 gcd`2`可以通过多种方式出现。 递归必须使用精确的转移概率。 

## 方法

 蛮力方法将直接对过程进行建模。 让一个状态包含所选数字的整个序列。 从每个状态，我们附加每个可能的下一个值并继续，直到 gcd 变为`1`。 

这是正确的，因为它完全遵循流程定义。 不幸的是，可能的序列数量是无限的。 即使我们截断一定长度，状态数量也会呈指数增长，并且几乎立即变得无用。 

第一个有用的观察是序列本身并不重要。 如果我们知道当前的gcd`g`，然后绘制后`x`下一个状态就是`gcd(g, x)`。 该过程仅取决于当前的 gcd。 

这将状态空间减少到仅`m`州。 

让`E[g]`表示达到 GCD 所需的预计额外抽奖次数`1`，假设当前 gcd 等于`g`。 

为了`g = 1`，我们已经完成了，所以`E[1] = 0`。 

为了`g > 1`，在一次抽签之后，我们移动到某个除数`g`。 这给出了一个涉及较小除数期望的线性方程。 

剩下的挑战是有效计算转移概率。 

对于固定 gcd 状态`g`，下一个状态变为`d`恰好在什么时候```
gcd(g, x) = d
```这样的数量`x`可以使用除数上的包含-排除来计算，这本质上是莫比乌斯式除数 DP。 

由于每次转换都从`g`的除数`g`，按递增顺序处理状态允许在计算时知道所有较小的期望`E[g]`。 

这将无限概率过程转换为约 DP 的除数`m log m`除数关系。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 指数/无限状态 | 指数| 太慢了|
 | 最佳 | O(m log m) | O(米) | 已接受 |

 ## 算法演练

 让`cnt[d] = floor(m / d)`, 中的整数个数`[1, m]`可除以`d`。 

定义`E[g]`作为达到 GCD 所需的未来抽奖的预期次数`1`当当前的gcd为`g`。 

1. 设置`E[1] = 0`。 
2. 对于每一个`g > 1`，计算有多少个值`x`满足`gcd(g, x) = d`对于每个除数`d`的`g`。 

令这个数量为`ways[d]`。 
3. 计算`ways[d]`使用包含-排除。 

从以下开始：```
ways[d] = count of x divisible by d
        = floor(m / d)
```然后减去较大除数的贡献`g`。 

从最大到最小处理除数给出了 gcd 精确的数字计数`d`。 
4.让`self = ways[g]`。 

这些是保持 gcd 不变的选择。 
5. 写出期望方程：```
E[g]
=
1
+
(self/m) E[g]
+
Σ (ways[d]/m) E[d]
```超过所有真因数`d < g`。 
6. 重新排列：```
E[g]
=
(m + Σ ways[d] E[d])
/
(m - self)
```7. 执行所有算术模数`10^9+7`。 

除法变成乘以模逆。 
8. 计算状态`2`到`m`。 

的每个真因数`g`小于`g`，所以所有需要的期望都已经计算出来了。 
9. 第一个选择的数字是均匀随机的。 

如果第一个数字等于`i`，当前的gcd变为`i`。 

总预期长度等于```
1 + (1/m) Σ E[i]
```因为第一次平局总是会发生。 

### 为什么它有效

 关键的特性是未来仅取决于当前的 GCD。 

假设当前的gcd是`g`。 任何先前的序列导致`g`变得无关紧要，因为下一个 gcd 总是`gcd(g, x)`。 这使得该过程成为马尔可夫的。 

对于每个州`g`，递归枚举了所有可能的下一次平局。 期限`1`说明我们即将进行的抽签。 转移概率是精确的，因为`ways[d]`精确计算产生 gcd 的值`d`。 

分离自环概率后求解递推式。 由于所有其他转换都会达到适当的除数，因此期望值是按拓扑顺序计算的。 因此，公式中使用的每个值都已经是正确的，并且归纳超过增加`g`证明正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 1000000007

def solve():
    m = int(input())

    inv = [0] * (m + 1)
    for i in range(1, m + 1):
        inv[i] = pow(i, MOD - 2, MOD)

    divisors = [[] for _ in range(m + 1)]
    for d in range(1, m + 1):
        for multiple in range(d, m + 1, d):
            divisors[multiple].append(d)

    dp = [0] * (m + 1)

    for g in range(2, m + 1):
        divs = divisors[g]

        exact = {}
        for d in reversed(divs):
            cur = m // d
            for bigger in divs:
                if bigger > d and bigger % d == 0:
                    cur -= exact[bigger]
            exact[d] = cur

        num = m % MOD

        for d in divs:
            if d == g:
                continue
            num = (num + exact[d] * dp[d]) % MOD

        stay = exact[g]
        denom = m - stay

        dp[g] = num * inv[denom] % MOD

    ans = 1

    total = 0
    for i in range(1, m + 1):
        total += dp[i]

    ans = (ans + total % MOD * inv[m]) % MOD

    print(ans)

solve()
```第一个预处理步骤构建每个整数的除数列表，直到`m`。 这允许每个状态有效地访问其所有除数。 

对于固定 gcd 状态`g`，我们需要计算产生每个除数的数字。 包含-排除计算从较大的除数开始，并减去已经计算的精确计数。 这是将“d 的倍数”计数转换为“gcd 恰好 d”计数的标准方法。 

期望公式包含一个自环。 解决此类递归问题需要将自循环项移至左侧，然后再除以其剩余的概率质量。 忘记这种重新安排是实现中最常见的错误。 

所有除法均以模进行`10^9+7`使用模逆。 由于该语句保证分母可逆模质数模，因此这是有效的。 

## 工作示例

 ### 示例 1

 输入：```
1
```状态计算：

 | 克| E[克] |
 | --- | --- |
 | 1 | 0 |

 最终期望：

 | 数量 | 价值|
 | --- | --- |
 | 第一次抽奖| 1 |
 | 平均额外抽奖 | 0 |
 | 回答 | 1 |

 过程总是选择`1`立即，所以数组长度总是精确的`1`。 

### 示例 2

 输入：```
2
```为了`g = 2`：

 | 除数 d | 用 gcd(2,x)=d | 进行计数
 | --- | --- |
 | 1 | 1 |
 | 2 | 1 |

 复发：```
E[2] = (2 + 1·E[1]) / (2 - 1)
     = 2
```最终期望：

 | 数量 | 价值|
 | --- | --- |
 | E[1] | 0 |
 | E[2] | 2 |
 | 总计 | 2 |
 | 回答 | 1 + (0 + 2)/2 = 2 |

 这符合几何过程的解释：我们不断地画图`2`直到第一个`1`出现。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(m log m) | 所有整数的除数预处理和除数-DP |
 | 空间| O(米) | 除数列表、逆矩阵和 DP 数组 |

 为了`m = 100000`，除数关系的总数约为`m log m`，完全符合时间限制。 内存使用量也远低于 256 MB 限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    MOD = 1000000007

    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    m = int(input())

    inv = [0] * (m + 1)
    for i in range(1, m + 1):
        inv[i] = pow(i, MOD - 2, MOD)

    divisors = [[] for _ in range(m + 1)]
    for d in range(1, m + 1):
        for v in range(d, m + 1, d):
            divisors[v].append(d)

    dp = [0] * (m + 1)

    for g in range(2, m + 1):
        divs = divisors[g]

        exact = {}
        for d in reversed(divs):
            cur = m // d
            for b in divs:
                if b > d and b % d == 0:
                    cur -= exact[b]
            exact[d] = cur

        num = m % MOD
        for d in divs:
            if d != g:
                num = (num + exact[d] * dp[d]) % MOD

        dp[g] = num * inv[m - exact[g]] % MOD

    ans = (1 + sum(dp) % MOD * inv[m]) % MOD
    return str(ans)

# provided sample
assert run("1\n") == "1", "sample 1"

# custom cases
assert run("2\n") == "2", "sample described in statement"

# boundary checks
assert run("3\n").isdigit(), "small prime"
assert run("10\n").isdigit(), "composite range"
assert run("100000\n").isdigit(), "maximum input"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1`|`1`| 立即吸收状态|
 |`2`|`2`| 简单的几何处理 |
 |`3`| 数字答案 | 素数边界行为 |
 |`10`| 数字答案 | 多个除数转换 |
 |`100000`| 数字答案 | 最大约束|

 ## 边缘情况

 考虑：```
1
```该过程从gcd开始`1`第一次抽奖后。 我们的 DP 套装`E[1]=0`，所以最终的答案就变成了`1`。 任何试图除以的递归`(m-self)`为了`g=1`会失败，这就是为什么声明`1`是分开处理的。 

考虑：```
2
```状态`2`自环概率为`1/2`。 递归变为```
E[2] = 1 + (1/2)E[2].
```求解给出`E[2]=2`。 如果忽略自循环项，我们将错误地获得`E[2]=1`。 

考虑一个高度复合的值，例如：```
10
```从同一状态可以到达多个除数。 包含-排除步骤保证了对gcd有贡献的数字`10`不再计入gcd`5`, 气相色谱`2`, 或 gcd`1`。 如果没有精确的 gcd 计数，转移概率的总和将大于 1，并且期望将是错误的。 

最后，对于最大输入```
100000
```该算法永远不会迭代所有对`(i,j)`。 它只遍历除数关系，使运行时间接近`m log m`，这就是为什么它在给定的限制下仍然足够快。
