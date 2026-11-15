---
title: "CF 914C - 旅行推销员和特殊号码"
description: "我们给出了一个上限 n，但 n 不是以十进制整数形式提供的。 相反，它直接作为长度可达 1000 位的二进制字符串给出。"
date: "2026-06-13T01:23:47+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "combinatorics", "dp"]
categories: ["algorithms"]
codeforces_contest: 914
codeforces_index: "C"
codeforces_contest_name: "Codecraft-18 and Codeforces Round 458 (Div. 1 + Div. 2, combined)"
rating: 1800
weight: 914
solve_time_s: 240
verified: true
draft: false
---

[CF 914C - 旅行推销员和特殊号码](https://codeforces.com/problemset/problem/914/C)

 **评分：** 1800
 **标签：** 暴力破解、组合数学、DP
 **求解时间：** 4m
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给定了一个上限`n`， 但`n`不以十进制整数形式提供。 相反，它直接作为长度可达 1000 位的二进制字符串给出。 我们考虑对正整数进行以下运算：

 取出该数字并将其替换为`1`其二进制表示形式中的位。 

例如：`13 → 3 → 2 → 1`因为`13 = 1101₂`具有三个设置位，`3 = 11₂`有两个设置位，并且`2 = 10₂`有一个设置位。 

如果需要达到的此类操作的最小数量，则称该数字为特殊数字`1`等于`k`。 

任务是统计有多少个正整数`x`满足`1 ≤ x ≤ n`并准确要求`k`操作达到`1`。 

限制的不寻常部分是`n`最多可包含 1000 个二进制数字。 这意味着数值`n`可以在附近`2^1000`，远远超出了可以列举的范围。 任何迭代数字最多的解决方案`n`立刻就不可能了。 

1000 位的长度限制表明与位长度成比例的算法是可以接受的。 二进制表示形式的动态规划（通常称为数字 DP）成为自然的候选者。 

一些边缘情况很容易被错误处理。 

考虑：```
1
0
```唯一数量不超过`1`是`1`本身。 自从`1`已经等于`1`，它需要零运算。 正确答案是`1`。 盲目应用正运算计数的一般递归的解决方案将错过这种情况。 

考虑：```
1
1
```没有号码`≤ 1`只需要一次操作。 数字`1`需要零操作。 正确答案是`0`。 

另一个微妙的情况是：```
10
1
```这里`n = 2`。 唯一的特殊号码是`2`， 因为`2 → 1`一步之遥。 数字`1`不得计算在内。 许多实现对具有一位设置位的所有数字进行计数，并意外地包括`1`。 

最后一个陷阱是在 DP 期间设置的位数可能为零。 价值`0`不是正整数，永远不应该对答案有贡献。 

## 方法

 暴力解决方案在概念上很简单。 对于每个整数`x`从`1`到`n`，反复用它的 popcount 替换它，直到达到`1`，计算需要多少步，并检查该计数是否等于`k`。 

操作链很短，因为 popcount 很快就会崩溃大量数字。 对于以下数字`2^1000`，一个应用程序最多产生一个值`1000`，之后值变得很小。 问题不在于链长，而在于起始值的数量。 什么时候`n`本身可能接近`2^1000`，迭代所有候选者是没有希望的。 

关键的观察是，在第一次操作之后，未来的行为仅取决于原始数字的设置位数。 

假设一个数字`x`恰好包含`s`其二进制表示形式。 

一次操作后：```
x → s
```从那时起，该过程完全由`s`。 

定义：```
f(v) = minimum operations needed to reduce v to 1
```对于普通整数`v`。 

如果`x`有`s`设置位和`x > 1`， 然后：```
f(x) = 1 + f(s)
```因此，我们不需要推理巨大的数字，而只需要知道它们包含多少个设置位。 由于二进制长度最多为1000，因此设置的位数也最多为1000。 

这将问题转化为两个独立的部分。 

首先，预计算`f(s)`为所有人`s ≤ 1000`。 

其次，对于每个可能的设置位计数`s`,数一下有多少个数字`x ≤ n`确切地包含`s`那些。 这是二进制字符串上的经典组合数字 DP 问题。 

对答案有贡献的数字正是那些设置位计数的数字`s`满足：```
1 + f(s) = k
```除特殊处理外`x = 1`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n log n) | O(n log n) | O(1) | O(1) | 太慢了 |
 | 最佳| O(L²) | O(L²) | 已接受 |

 这里`L`是二进制长度`n`, 至多`1000`。 

## 算法演练

 1.读取二进制字符串`n`并让`L`是它的长度。 
2.特殊情况处理`k = 0`。 

唯一需要零运算的数字是`1`本身。 如果`1 ≤ n`，这总是正确的，因为`n`是肯定的，答案是`1`。 
3. 预先计算所有值的操作计数`1`到`1000`。 

让：```
steps[1] = 0
steps[i] = 1 + steps[popcount(i)]
```为了`i > 1`。 

自从`popcount(i) < i`对于每一个`i > 1`，可以按升序计算这些值。 
4. 确定所有设置位计数`s`满意：```
1 + steps[s] = k
```任意数字恰好符合`s`那些将需要确切`k`操作，前提是数字本身大于`1`。 
5. 预先计算二项式系数`C(n,r)`模数`10^9+7`为所有人`0 ≤ n,r ≤ 1000`。 

这些系数使我们能够计算出有多少特定剩余长度的二进制字符串包含给定数量的 1。 
6. 对于每个有效的设置位计数`s`,数一下有多少个数字`x ≤ n`正好有`s`那些。 

扫描位`n`从左到右。 

每当一个位置包含`1`，我们可以放置`0`并使结果数字严格小于`n`。 剩下的位置可以任意填补。 

如果我们已经使用过`used`到目前为止，有`rem`剩下的位置，然后选择`0`在当前位置贡献：```
C(rem, s - used)
```每当`s - used`是可行的。 

然后假设我们匹配继续扫描`n`并放置`1`，增加`used`。 
7. 扫描完成后，如果数量`n`本身恰好包含`s`的，再添加一个计数。 
8. 将所有有效计数相加`s`。 
9. 什么时候`k = 1`，从答案中减一。 

原因是`s = 1`满足：```
1 + steps[1] = 1
```计数程序包括数量`1`。 但`1`实际上需要零次操作，而不是一次。 
10. 输出结果取模`10^9+7`。 

### 为什么它有效

 对于每个正整数`x > 1`，第一个操作将其发送到`popcount(x)`。 在那一刻之后，未来的序列仅取决于该 popcount 值。 如果`x`包含`s`，那么操作总数等于`1 + steps[s]`。 

该算法枚举了所有可能的值`s`这导致了`k`运营。 对于每一个这样的`s`，digit-DP计数程序对每个数字进行计数`≤ n`恰好与`s`只设置一次位。 组合转换对应于构造的数字变得小于的第一个位置`n`。 

由于每个有效数字都有一个唯一的设置位计数，并且每个计数的数字都满足所需的操作计数，因此最终的总和正是所需的答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10 ** 9 + 7

n = input().strip()
k = int(input())

L = len(n)

if k == 0:
    print(1)
    sys.exit()

# steps[i] = operations needed for i -> 1
steps = [0] * (L + 1)
steps[1] = 0

for i in range(2, L + 1):
    steps[i] = steps[i.bit_count()] + 1

# binomial coefficients
C = [[0] * (L + 1) for _ in range(L + 1)]
for i in range(L + 1):
    C[i][0] = C[i][i] = 1
    for j in range(1, i):
        C[i][j] = (C[i - 1][j - 1] + C[i - 1][j]) % MOD

def count_with_ones(target):
    used = 0
    res = 0

    for i, ch in enumerate(n):
        if ch == '1':
            rem = L - i - 1
            need = target - used

            if 0 <= need <= rem:
                res = (res + C[rem][need]) % MOD

            used += 1

    if used == target:
        res = (res + 1) % MOD

    return res

ans = 0

for ones in range(1, L + 1):
    if 1 + steps[ones] == k:
        ans = (ans + count_with_ones(ones)) % MOD

if k == 1:
    ans = (ans - 1) % MOD

print(ans % MOD)
```这`steps`数组存储最多 1000 个小整数所需的操作数。这是有效的，因为在一次 popcount 操作后，每个相关数字最多变为`n`。 

二项式表支持计数阶段。 当扫描遇到`1`咬进去`n`，我们可以选择一个较小的数字`0`并将剩余所需人员自由分配到剩余职位中。 这种分布的数量恰好是一个二项式系数。 

功能`count_with_ones(target)`执行数字 DP 计数。 它没有将状态存储在 DP 表中，而是使用二进制上限的标准组合计数技巧。 

减法为`k = 1`是实现中最微妙的部分。 具有一位设置位的数字满足条件`1 + steps[1] = 1`，但是数量`1`本身不应该属于该类别，因为它已经等于`1`在进行任何操作之前。 

## 工作示例

 ### 示例 1

 输入：```
110
2
```这里`n = 6`。 

有效的设置位计数满足：```
1 + steps[s] = 2
```仅有的`s = 2`有效是因为：```
2 -> 1
```一步之遥。 

计算 ≤ 1102 且恰好有两个的数字：

 | 职位| n 位 | 之前用过 | 贡献 |
 | --- | --- | --- | --- |
 | 0 | 1 | 0 | C(2,2)=1 | C(2,2)=1 |
 | 1 | 1 | 1 | C(1,1)=1 | C(1,1)=1 |
 | 2 | 0 | 2 | 0 |

 最终的数字本身也有两个，所以加一。 

| 来源 | 计数|
 | --- | --- |
 | 011 2 = 3 | 1 |
 | 101 2 = 5 | 1 |
 | 110 2 = 6 | 1 |
 | 总计 | 3 |

 输出：```
3
```此示例显示计数过程如何枚举具有固定 popcount 的所有数字，而不显式生成它们。 

### 示例 2

 输入：```
10
1
```这里`n = 2`。 

有效设置位计数满足：```
1 + steps[s] = 1
```仅有的`s = 1`。 

用一组位来计数：

 | 数量 | 那些 |
 | --- | --- |
 | 1 | 1 |
 | 2 | 1 |

 计数例程返回`2`。 

然而，`1`需要零操作：```
1
```所以我们减去它。 

| 数量 | 价值|
 | --- | --- |
 | 原始计数 | 2 |
 | 删除数字 1 | -1 |
 | 最终答案| 1 |

 剩余有效数为`2`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(L²) | 建筑组合占主导|
 | 空间| O(L²) | 二项式系数表|

 和`L ≤ 1000`，该表包含大约一百万个条目。 这很容易满足内存限制，并且 Python 中的二次预处理速度非常快。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve():
    MOD = 10 ** 9 + 7

    n = input().strip()
    k = int(input())

    L = len(n)

    if k == 0:
        print(1)
        return

    steps = [0] * (L + 1)
    for i in range(2, L + 1):
        steps[i] = steps[i.bit_count()] + 1

    C = [[0] * (L + 1) for _ in range(L + 1)]
    for i in range(L + 1):
        C[i][0] = C[i][i] = 1
        for j in range(1, i):
            C[i][j] = (C[i - 1][j - 1] + C[i - 1][j]) % MOD

    def count(target):
        used = 0
        res = 0

        for i, ch in enumerate(n):
            if ch == '1':
                rem = L - i - 1
                need = target - used

                if 0 <= need <= rem:
                    res += C[rem][need]

                used += 1

        if used == target:
            res += 1

        return res % MOD

    ans = 0
    for s in range(1, L + 1):
        if 1 + steps[s] == k:
            ans += count(s)

    if k == 1:
        ans -= 1

    print(ans % MOD)

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    global input
    input = sys.stdin.readline

    solve()

    out = sys.stdout.getvalue().strip()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return out

# provided sample
assert run("110\n2\n") == "3", "sample 1"

# minimum value
assert run("1\n0\n") == "1", "only number 1"

# number 1 is not special for k=1
assert run("1\n1\n") == "0", "special handling of 1"

# boundary where only 2 qualifies
assert run("10\n1\n") == "1", "remove number 1"

# numbers <= 3 needing exactly one operation: only 2
assert run("11\n1\n") == "1", "small boundary"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 0`|`1`| 零操作特例|
 |`1 / 1`|`0`| 当 k=1 | 时，数字 1 不能被计算在内
 |`10 / 1`|`1`| 数字 1 的正确减法 |
 |`11 / 1`|`1`| 包含上限计数 |
 |`110 / 2`|`3`| 示例场景 |

 ## 边缘情况

 考虑：```
1
0
```该算法立即触发专用`k = 0`分支和返回`1`。 不需要 DP。 这符合事实，即只有数字`1`已经等于目标状态。 

考虑：```
1
1
```一般的 popcount 计数逻辑将用一组位来识别数字。 这包括`1`。 修正为`k = 1`完全删除这个不需要的贡献，留下答案`0`。 

考虑：```
10
1
```计数例程找到两个具有一位设置位的数字，即`1`和`2`。 减去贡献后`1`， 仅有的`2`遗迹。 最终答案变成`1`，这是正确的，因为：```
2 -> 1
```仅需一次操作。 

考虑：```
1000
2
```这里`n = 8`。 有效的设置位计数为`2`。 digital-DP 精确计算数字：```
3, 5, 6
```每个都有两个，并且：```
3 -> 2 -> 1
5 -> 2 -> 1
6 -> 2 -> 1
```没有更大的数字不超过`8`有两个设置位。 答案是`3`，确认组合计数正确处理精确的上限限制。
