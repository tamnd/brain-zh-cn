---
title: "CF 1983E - 我爱球"
description: "有两种球。 前k个球是特殊的，剩下的n-k个是普通的。 每个球都有其价值。 球以均匀随机的顺序被一颗一颗地移除。 当前玩家拿走所选的球并将其值添加到他们的分数中。"
date: "2026-06-08T16:38:36+07:00"
tags: ["codeforces", "competitive-programming", "combinatorics", "math", "probabilities"]
categories: ["algorithms"]
codeforces_contest: 1983
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 956 (Div. 2) and ByteRace 2024"
rating: 2300
weight: 1983
solve_time_s: 200
verified: true
draft: false
---

[CF 1983E - 我爱球](https://codeforces.com/problemset/problem/1983/E)

 **评分：** 2300
 **标签：** 组合数学、数学、概率
 **求解时间：** 3m 20s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 有两种球。 第一个`k`球是特殊的，剩下的`n-k`很普通。 每个球都有其价值。 

球以均匀随机的顺序被一颗一颗地移除。 当前玩家拿走所选的球并将其值添加到他们的分数中。 有趣的规则是接下来会发生什么。 

如果选择的球是普通球，则轮到另一位玩家。 

如果选择的球是特殊的，则同一球员立即再次比赛。 

爱丽丝开始。 

我们需要 Alice 的预期最终得分和 Bob 的预期最终得分。 由于答案是一个有理数，我们将其模数输出`10^9+7`使用模逆。 

所有测试用例中的球总数最多为`5 · 10^5`。 任何试图枚举子集上的排列、游戏状态或概率分布的算法都是没有希望的。 甚至`O(n^2)`在最坏的情况下，每个测试用例的成本都太高了。 我们需要与球的数量基本呈线性关系的东西。 

主要的危险是假设每个球都有概率`1/2`属于爱丽丝的。 这是错误的，因为只有当普通球被拿走时，回合才会改变。 

考虑：```
n = 2, k = 1
special value = 10
ordinary value = 20
```两种可能的顺序是：```
S N
```爱丽丝得到了两个球。```
N S
```爱丽丝只得到普通的球。 

Alice 的期望分数是`25`， 不是`(10+20)/2 = 15`。 

另一个容易犯的错误是将特殊球和普通球一视同仁。 他们的所有权概率不同。 

例如：```
n = 3, k = 1
values = [100, 1, 1]
```与普通球相比，特殊球更有可能属于爱丽丝。 任何计算每个球的单一概率的解决方案都会产生错误的期望。 

案例`k = n`也很特别。 没有普通的球，所以回合永远不会改变，爱丽丝有概率收到每个球`1`。 

## 方法

 暴力解决方案将生成所有可能的球顺序。 对于每个排列，我们可以模拟游戏，计算结果分数，并对所有排列进行平均。 

这是正确的，因为每个移除命令都有相同的可能性。 问题在于状态空间的大小。 有`n!`可能的订单。 即使是为了`n = 15`，这已经超过一万亿种排列。 

关键的观察结果是预期值是线性的。 

我们可以问一个小得多的问题，而不是询问整个分数分布：

 “某个球属于爱丽丝的概率是多少？”

 如果我们知道这个概率，那么球就会贡献```
value × probability
```达到爱丽丝的预期分数。 

所有特殊球都是对称的。 所有普通球都是对称的。 所以我们只需要两个概率：```
pS = probability a specific special ball belongs to Alice
pN = probability a specific ordinary ball belongs to Alice
```一旦知道了这些，```
Alice =
pS × (sum of special values)
+
pN × (sum of ordinary values)
```Bob 收到剩余的期望值。 

剩下的任务纯粹是组合的。 

关键的简化是特殊球永远不会改变轮到谁。 只有普通球才会引起交替。 如果我们只看普通球的顺序，爱丽丝拥有第一个，鲍勃拥有第二个，爱丽丝拥有第三个，依此类推。 

特殊的球只是插入到那些普通球所形成的间隙中。 

这将整个游戏变成了计算差距和排名，从而形成线性时间解决方案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |`O(n! · n)`|`O(n)`| 太慢了 |
 | 最佳 |`O(n)`每个测试用例|`O(1)`额外 | 已接受 |

 ## 算法演练

 让```
m = n - k
```是普通球的数量。 

### 特殊球的概率

 想象一下去掉所有特殊的球并只保留`m`普通球。 

他们准确地创造了`m + 1`差距：```
before first ordinary
between ordinary 1 and 2
between ordinary 2 and 3
...
after last ordinary
```每当一个普通球被拿走时，球员的身份就会改变。 

因此间隙的所有权交替：```
Alice, Bob, Alice, Bob, ...
```拿一个特别的球。 

它在普通球中的相对位置仅取决于它前面出现的普通球的数量。 该数字可以是以下任意值`0`到`m`。 

根据对称性，所有`m + 1`可能性是同样可能的。 

因此，特殊的球在间隙中均匀地选择`m + 1`差距。 

爱丽丝拥有```
ceil((m + 1) / 2)
```这些差距。 

所以```
pS = ceil((m + 1) / 2) / (m + 1)
```### 普通球的概率

 考虑一个特殊的普通球。 

其中`m`普通球，其等级同样可能是以下任意值`1`到`m`。 

第一个普通球属于爱丽丝。 

第二个属于鲍勃。 

第三个属于爱丽丝。 

等等。 

爱丽丝恰好拥有奇数等级。 

奇数列的个数为```
ceil(m / 2)
```因此```
pN = ceil(m / 2) / m
```什么时候`m > 0`。 

### 计算期望

 让```
special_sum = sum of first k values
ordinary_sum = sum of remaining values
```然后```
Alice =
special_sum × pS
+
ordinary_sum × pN
```所有算术均以模进行`10^9+7`。 

Bob receives the remaining expected value:```
Bob =
(total_sum - Alice)
```### 为什么它有效

 任何球的所有权仅取决于出现在其前面的普通球的数量。 特殊球永远不会改变回合奇偶性。 

对于特殊球来说，唯一相关的量是它落地的普通球之间的间隙。 每个缺口的可能性都是相等的，并且缺口的所有权是交替的。 

对于普通球来说，唯一相关的量就是它在普通球中的排名。 每个等级的可能性均等，并且所有权按等级平价交替。 

由于期望是线性的，因此将所有球的值乘以所有权概率即可得出准确的期望分数。 对称性将计算减少为所有特殊球的一种概率和所有普通球的一种概率。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7

t = int(input())

for _ in range(t):
    n, k = map(int, input().split())
    v = list(map(int, input().split()))

    m = n - k

    special_sum = sum(v[:k]) % MOD
    ordinary_sum = sum(v[k:]) % MOD

    if m == 0:
        alice = special_sum
        bob = 0
        print(alice, bob)
        continue

    pS = ((m + 2) // 2) * pow(m + 1, MOD - 2, MOD)
    pS %= MOD

    pN = ((m + 1) // 2) * pow(m, MOD - 2, MOD)
    pN %= MOD

    alice = (special_sum * pS + ordinary_sum * pN) % MOD

    total = (special_sum + ordinary_sum) % MOD
    bob = (total - alice) % MOD

    print(alice, bob)
```第一步分别计算所有特殊球和所有普通球的总价值。 

当没有普通球时，转弯永远不会改变。 爱丽丝收集了所有东西，所以答案是立即的。 

为了`m > 0`，代码评估上面导出的两个概率。 模运算下的除法是使用费马定理实现的：```
x / y  ->  x * y^(MOD-2)
```Alice 的期望分数是直接根据期望的线性计算出来的。 

Bob 的期望分数是通过从总值中减去 Alice 的期望分数而得到的。 这避免了重复的概率计算，并自动保留两个期望之和等于总值的不变量。 

唯一微妙的极端情况是`m = 0`， 因为`pN`需要除以零。 该案单独处理。 

## 工作示例

 ### 示例 1

 输入：```
n = 5
k = 2
values = [10, 20, 5, 15, 25]
```我们有：```
special_sum = 30
ordinary_sum = 45
m = 3
```| 数量 | 价值|
 | ---| ---|
 | 米 | 3 |
 | pS | 2 / 4 = 1/2 | 2 / 4 = 1/2 |
 | PN | 2 / 3 | 2 / 3
 | 特别贡献 | 30 × 1/2 = 15 |
 | 普通贡献 | 45 × 2/3 = 30 |
 | 爱丽丝| 45 | 45
 | 鲍勃 | 30|

 答案是：```
45 30
```这个例子表明特殊球和普通球使用不同的概率。 

### 自定义示例```
n = 3
k = 1
values = [100, 1, 1]
```| 数量 | 价值|
 | ---| ---|
 | 米 | 2 |
 | pS | 2/3 |
 | PN | 1/2 | 1/2
 | 特别贡献 | 100 × 2/3 |
 | 普通贡献 | 2 × 1/2 = 1 |
 | 爱丽丝| 203/3 |
 | 鲍勃 | 102 - 203/3 = 103/3 |

 这个例子强调了为什么特殊球不能被视为具有概率`1/2`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O(n)`| 计算总和时每个球都会被访问一次 |
 | 空间|`O(1)`| 除了输入数组之外只有几个变量 |

 所有测试用例中的球总数最多为`5 · 10^5`，因此线性扫描很容易满足时间限制。 除了存储当前测试用例之外，内存使用量是恒定的。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

MOD = 10**9 + 7

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline
    t = int(input())
    out = []

    for _ in range(t):
        n, k = map(int, input().split())
        v = list(map(int, input().split()))

        m = n - k

        ss = sum(v[:k]) % MOD
        sn = sum(v[k:]) % MOD

        if m == 0:
            out.append(f"{ss} 0")
            continue

        pS = ((m + 2) // 2) * pow(m + 1, MOD - 2, MOD) % MOD
        pN = ((m + 1) // 2) * pow(m, MOD - 2, MOD) % MOD

        alice = (ss * pS + sn * pN) % MOD
        bob = (ss + sn - alice) % MOD

        out.append(f"{alice} {bob}")

    return "\n".join(out)

# sample
assert run(
"""1
5 2
10 20 5 15 25
"""
) == "45 30"

# minimum size
assert run(
"""1
1 1
7
"""
) == "7 0"

# all balls special
assert run(
"""1
4 4
1 2 3 4
"""
) == "10 0"

# one special, one ordinary
assert run(
"""1
2 1
10 20
"""
) == "25 5"

# all values equal
assert run(
"""1
5 2
1 1 1 1 1
"""
) == "3 2"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 1 / 7`|`7 0`| 尽可能小的实例 |
 |`4 4 / 1 2 3 4`|`10 0`| 不是普通的球|
 |`2 1 / 10 20`|`25 5`| 特殊球和普通球的不同概率 |
 |`5 2 / 1 1 1 1 1`|`3 2`| 对称性和期望算术 |

 ## 边缘情况

 ### 所有球都很特别

 输入：```
1
4 4
1 2 3 4
```没有普通的球。 转弯永远不会改变。 

爱丽丝拿走每个球：```
Alice = 10
Bob = 0
```该实现在计算任何模逆之前处理这个问题。 

### 就是一个普通的球

 输入：```
1
2 1
10 20
```普通球前有一间隙，后一间隙。 

特殊球以相同的概率落在任一间隙中。```
pS = 1/2
pN = 1
```Alice 的期望变为：```
10 × 1/2 + 20 × 1 = 25
```与直接枚举匹配。 

### 许多特殊球，对奇偶性没有影响

 输入：```
1
5 4
10 10 10 10 100
```只有一个普通球存在。 

所有四个特殊球都有相同的概率：```
pS = 1/2
```无论有多少特殊球。 推导仅取决于普通球的数量，因为只有普通球影响回合变化。 这正是算法所使用的属性。 

### 普通球的偶数与奇数

 输入：```
1
3 1
100 1 1
```这里`m = 2`。 

爱丽丝拥有三个缺口中的两个，给出```
pS = 2/3
```而不是`1/2`。 

假设每个特殊球都同样可能属于任一玩家的解决方案在此示例中将失败。 间隙计数论证正确地产生了更大的概率。
