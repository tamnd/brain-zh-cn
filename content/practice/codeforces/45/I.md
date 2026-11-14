---
title: "CF 45I-TCMCF+++"
description: "我们得到了一个代表竞赛中问题分数的整数列表。 参赛者可以解决这些问题的任何非空子集，最终得分成为所有选定值的乘积。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "greedy"]
categories: ["algorithms"]
codeforces_contest: 45
codeforces_index: "I"
codeforces_contest_name: "School Team Contest 3 (Winter Computer School 2010/11)"
rating: 1400
weight: 45
solve_time_s: 138
verified: false
draft: false
---

[CF 45I - TCMCF+++](https://codeforces.com/problemset/problem/45/I)

 **评分：** 1400
 **标签：** 贪婪
 **求解时间：** 2m 18s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了一个代表竞赛中问题分数的整数列表。 参赛者可以解决这些问题的任何非空子集，最终得分成为所有选定值的乘积。 

任务不是计算最大乘积本身，而是输出一个乘积尽可能大的子集。 

限制非常小。 最多有 100 个数字，每个数字在 -100 到 100 之间。即使限制很小，子集的数量仍然呈指数级增长。 暴力搜索需要检查所有$2^n - 1$非空子集。 和$n = 100$，那是完全不可能的。 

问题的棘手部分是正确处理负数和零。 正值总是有帮助的，因为乘以大于零的正数会增加乘积。 负值更加微妙。 偶数个负数产生正乘积，奇数个产生负乘积。 

一些边缘情况很容易破坏粗心的解决方案。 

假设所有数字都是负数并且它们的计数是奇数。 

输入：```
3
-1 -2 -3
```选择所有数字给出$(-1) \cdot (-2) \cdot (-3) = -6$。 

但只选择`-2 -3`给出`6`，更大。 

正确答案去掉绝对值最小的负数，这里`-1`。 

现在考虑一种只有一个负数和零的情况。 

输入：```
4
-5 0 0 0
```选择`-5`给出`-5`。 

选择任何单个零给出`0`，更大。 

始终保持非零值的贪婪方法在这里会失败。 

另一种危险情况是每个值都为零时。 

输入：```
3
0 0 0
```我们仍然必须输出至少一个数字。 

最好的产品是`0`，因此打印一个零是正确的。 

最小的有效输入也很重要。 

输入：```
1
-7
```即使乘积为负，我们也被迫采用唯一可用的数字。 

## 方法

 暴力解决方案很简单。 我们迭代每个非空子集，计算其乘积，并保留具有最大结果的子集。 

这是有效的，因为分数的定义直接取决于子集。 每个候选人都可以被独立评估。 

问题是子集的数量。 和$n = 100$，总数大致变为$1.27 \times 10^{30}$。 即使每秒检查十亿个子集也无法在宇宙的生命周期内完成。 

关键的观察结果是乘法对于符号的表现非常可预测。 

正数总是有用的。 乘以大于 1 的正数会增加乘积。 乘以 1 可以保持乘积不变，但仍然没有坏处。 

负数只有成对才有用。 两个负面因素会产生积极的贡献。 如果负数的数量是奇数，则必须丢弃恰好一个负数。 为了尽可能减少幅度损失，我们应该丢弃最接近零的负值。 

零永远不会改善积极的产品。 他们唯一的目的是挽救每一个可实现的非零乘积都为负的情况。 

这将问题变成了一个简单的贪心选择过程。 

我们保留：

 1. 每个正数。 
2. 除可能的 1 之外的所有负数。 
3. 如果负数为奇数，则删除绝对值最小的负数。 
4. 如果没有剩余，则输出一个零（如果有），否则输出唯一的负数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(2^n \cdot n)$|$O(n)$| 太慢了|
 | 最佳 |$O(n)$|$O(n)$| 已接受 |

 ## 算法演练

 1. 读取所有数字并将它们分为正数、负数和零。 

这使得以后的决策变得更加简单，因为每个类别在乘法下的表现都不同。 
2. 将每个正数添加到答案中。 

任何正值都会有助于或至少不会减少乘积。 
3. 将负数按绝对值排序。 

当我们需要丢弃负数时，最接近零的负数是最无用的。 
4. 如果否定数是偶数，则将所有否定数添加到答案中。 

他们的产品变得积极。 
5. 如果负数的数量是奇数，则恰好丢弃一个负数，特别是绝对值最小的负数，然后添加其余的。 

消除任何其他负数都会更严重地降低最终的幅度。 
6. 如果答案仍为空，则处理特殊情况。 

如果存在零，则输出一零，因为$0$比任何负积都大。 

否则整个数组中正好有一个负数，所以输出。 
7. 打印选定的号码。 

### 为什么它有效

 该算法首先最大化符号，然后最大化幅度。 

正乘积总是比零好，而零总是比负乘积好。 正品中，绝对值越大越好。 

应包括所有正数，因为乘以它们永远不会减少乘积。 负数仅成对产生正值，因此奇数计数会强制删除一个。 删除最接近零的负数可以保留剩余乘积的最大可能绝对值。 

如果无法形成正积，则尽可能选择零是最佳选择。 仅当数组包含单个负数且没有零时，我们才被迫输出负值。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    a = list(map(int, input().split()))

    positives = []
    negatives = []
    zeros = []

    for x in a:
        if x > 0:
            positives.append(x)
        elif x < 0:
            negatives.append(x)
        else:
            zeros.append(x)

    negatives.sort(key=abs)

    ans = []

    ans.extend(positives)

    if len(negatives) % 2 == 0:
        ans.extend(negatives)
    else:
        ans.extend(negatives[1:])

    if not ans:
        if zeros:
            ans.append(0)
        else:
            ans.append(negatives[0])

    print(*ans)

solve()
```解决方案首先将数字分为三组，因为正数、负数和零需要不同的处理策略。 

负数按绝对值而不是数值排序。 这个细节很重要。 我们想要删除最接近零的负数，而不是最小的数值。 例如，之间`-100`和`-1`，去除`-1`好多了。 

该行：```
ans.extend(negatives[1:])
```之所以有效，是因为负数是按绝对值排序的。 第一个元素是最无用的负数，因此跳过它会留下最佳的偶数大小的集合。 

最后的特殊情况块是必不可少的。 如果没有它，输入如下：```
3
0 0 0
```会产生一个空输出，这是无效的，因为至少必须解决一个问题。 

Python 整数自动处理大型产品，因此不必担心溢出。 

## 工作示例

 ### 示例 1

 输入：```
5
1 2 -3 3 3
```| 步骤| 优点 | 负面| 零| 回答 |
 | ---| ---| ---| ---| ---|
 | 初始分裂 |`[1,2,3,3]`|`[-3]`|`[]`|`[]`|
 | 添加积极因素 |`[1,2,3,3]`|`[-3]`|`[]`|`[1,2,3,3]`|
 | 奇数负数，丢弃`-3`|`[1,2,3,3]`|`[-3]`|`[]`|`[1,2,3,3]`|

 输出：```
1 2 3 3
```该迹线表明，单独的负值是有害的，因为它会将整个产品翻转为负值。 

### 示例 2

 输入：```
4
-5 0 0 0
```| 步骤| 优点 | 负面| 零| 回答 |
 | ---| ---| ---| ---| ---|
 | 初始分裂 |`[]`|`[-5]`|`[0,0,0]`|`[]`|
 | 奇数负数，丢弃`-5`|`[]`|`[-5]`|`[0,0,0]`|`[]`|
 | 空答案，选零|`[]`|`[-5]`|`[0,0,0]`|`[0]`|

 输出：```
0
```这个例子说明了为什么零很重要。 零乘积比负乘积更好。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(n \log n)$| 对负数进行排序占主导地位 |
 | 空间|$O(n)$| 答案和类别数组存储输入值 |

 和$n \le 100$，这个解决方案很容易足够快。 甚至一个$O(n^2)$解决方案会顺利通过，因此对数排序成本可以忽略不计。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve():
    input = sys.stdin.readline

    n = int(input())
    a = list(map(int, input().split()))

    positives = []
    negatives = []
    zeros = []

    for x in a:
        if x > 0:
            positives.append(x)
        elif x < 0:
            negatives.append(x)
        else:
            zeros.append(x)

    negatives.sort(key=abs)

    ans = []

    ans.extend(positives)

    if len(negatives) % 2 == 0:
        ans.extend(negatives)
    else:
        ans.extend(negatives[1:])

    if not ans:
        if zeros:
            ans.append(0)
        else:
            ans.append(negatives[0])

    print(*ans)

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    backup = sys.stdout
    sys.stdout = out

    solve()

    sys.stdout = backup
    return out.getvalue().strip()

# provided sample
res = run("5\n1 2 -3 3 3\n")
assert set(map(int, res.split())) == {1, 2, 3}

# minimum size
assert run("1\n-7\n") == "-7", "single negative"

# all zeros
assert run("3\n0 0 0\n") == "0", "all zeros"

# odd number of negatives
res = run("3\n-1 -2 -3\n")
vals = sorted(map(int, res.split()))
assert vals == [-3, -2], "remove smallest abs negative"

# even number of negatives
res = run("4\n-1 -2 -3 -4\n")
vals = sorted(map(int, res.split()))
assert vals == [-4, -3, -2, -1], "keep all negatives"

# positives and zeros
res = run("5\n0 1 2 0 3\n")
vals = sorted(map(int, res.split()))
assert vals == [1, 2, 3], "ignore zeros"

# large boundary style case
arr = " ".join(["-1"] * 99 + ["2"])
res = run(f"100\n{arr}\n")
vals = list(map(int, res.split()))
assert len(vals) == 99, "discard one negative from odd count"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / -7`|`-7`| 最小尺寸输入 |
 |`0 0 0`|`0`| 空答案处理 |
 |`-1 -2 -3`|`-2 -3`| 奇怪的负片需要一次删除 |
 |`-1 -2 -3 -4`| 所有四个负面| 即使是负面的也应该全部保留|
 |`0 1 2 0 3`|`1 2 3`| 当存在正数时应忽略零 |
 | 99 个阴性和 1 个阳性 | 99 个选定值 | 大边界行为 |

 ## 边缘情况

 考虑输入：```
3
-1 -2 -3
```按绝对值排序的负数变为：```
[-1, -2, -3]
```有 3 个负数，因此计数为奇数。 该算法去除了`-1`因为它的绝对值最小。 剩下的产品变成：```
(-2) * (-3) = 6
```任何其他去除都会产生较小的产品。 

现在考虑：```
4
-5 0 0 0
```该算法最初删除`-5`因为它是唯一的负数并且计数是奇数。 答案变得空洞。 由于零存在，算法输出`0`。 

这是正确的，因为：```
0 > -5
```最后，检查全零情况：```
3
0 0 0
```没有选择正面或负面的内容。 在特殊情况处理附加一个零之前，答案将保持为空。 

如果没有这一步，程序将错误地不打印任何内容，从而违反了必须选择至少一个问题的要求。
