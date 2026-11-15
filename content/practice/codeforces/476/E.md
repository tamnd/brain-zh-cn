---
title: "CF 476E - 梦月和弦乐"
description: "我们从字符串 s 开始。 我们可以恰好删除 x 个字符，而使剩余字符保持原始顺序。 结果字符串是 s 的子序列。 在生成的字符串中，我们尽可能多地查找模式 p 的非重叠出现。"
date: "2026-05-30T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dp", "strings"]
categories: ["algorithms"]
codeforces_contest: 476
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 272 (Div. 2)"
rating: 2200
weight: 476
solve_time_s: 345
verified: true
draft: false
---

[CF 476E - Dreamoon 和弦乐](https://codeforces.com/problemset/problem/476/E)

 **评分：** 2200
 **标签：** dp、字符串
 **求解时间：** 5m 45s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们从一个字符串开始`s`。 我们可以直接删除`x`字符，使其余字符保持原始顺序。 结果字符串是以下的子序列`s`。 

在结果字符串中，我们寻找尽可能多的**非重叠**出现的模式`p`尽可能。 对于每个删除计数`x`从`0`到`|s|`，我们必须输出可以实现的最大出现次数。 

关键的难点在于删除后要对出现次数进行计数。 的副本`p`不需要作为原始字符串的子字符串出现。 我们可能会删除中间的字符并使远处的字符变得相邻。 

长度为`s`最多 2000，而`p`长度最多为 500。三次解已经有风险，并且任何接近枚举所有子序列的操作都是完全不可能的。 解决方案围绕`O(n²)`或者`O(n² + nm)`是正确的目标。 

有几种情况很容易出错。 

考虑：```
s = "aa"
p = "aa"
```如果零删除，我们就会出现一次。 通过一次删除，我们只有`"a"`，所以答案为零。 一个常见的错误是只计算一次出现所需的最小删除，并得出结论认为每个更大的删除计数也是可能的。 这是错误的。 

另一个微妙的情况是：```
s = "abca"
p = "aa"
```该模式不是以下的子串`s`，但也可以通过删除来形成`"bc"`。 任何仅搜索原始字符串的子字符串的解决方案都会错过有效的答案。 

当出现的事件共享原始字符串中的字符时，就会出现第三个陷阱：```
s = "aaaaa"
p = "aa"
```最终字符串中的出现次数必须不重叠。 选择职位`(1,2)`和`(2,3)`是非法的，因为相同的角色参与了两个副本。 动态规划必须强制执行不相交的区间。 

## 方法

 暴力方法会尝试每一个子序列`s`，计算有多少个不重叠的副本`p`出现，并更新相应删除计数的答案。 由于长度为 2000 的字符串有`2^2000`后续，这是没有希望的。 

下一个观察结果是，单次出现`p`最终字符串中对应于选择位置`s`那个咒语`p`作为子序列。 假设第一个选择的位置是`l`最后选择的位置是`r`。 区间内`[l, r]`，必须删除该事件未使用的每个字符。 强制删除的次数为$$(r-l+1)-|p|.$$如果我们知道代表一次事件的最便宜的间隔，那么问题就开始看起来像间隔调度。 

对于每个起始位置`i`，我们计算最早可能的结束位置`end[i]`这样`p`可以作为从以下位置开始的子序列进行匹配`i`。 如果存在这样的间隔，则选择它会导致一次事件发生并强制$$(end[i]-i+1)-|p|$$删除。 

现在问题变成：

 选择几个不重叠的发生间隔。 最大限度地减少获得准确数据所需的强制删除次数`k`发生。 

一旦知道了最小值，最终的答案就变得很容易。 所有选定间隔之外的字符都是不相关的。 它们可以自由保留或删除。 这会将最小删除 DP 转换为每个精确删除计数的答案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O(2^n)`|`O(n)`| 太慢了 |
 | 具有间隔转换的最佳 DP |`O(n² + nm)`|`O(n²)`| 已接受 |

 ## 算法演练

 1. 预先计算下一个出现表`s`。 

对于每个位置和每个字母，将该字母第一次出现的位置存储在该位置处或该位置之后。 这允许在恒定时间内对每个字符进行子序列匹配`p`。 
2. 对于每个位置`i`在`s`，计算代表一次出现的最早间隔`p`。 

如果`s[i]`不等于`p[0]`，任何事件都不能从那里开始。 

否则，贪婪地匹配剩余的字符`p`使用下一个出现表。 如果匹配成功并在位置结束`r`， 店铺：```
end[i] = r
cost[i] = (r - i + 1) - m
```在哪里`m = |p|`。 
3.让`dp[pos][k]`是处理完之前结尾的前缀后所需的最小强制删除次数`pos`，同时精确创建`k`发生。 

初始化：```
dp[0][0] = 0
```4. 从左到右处理位置。 

在位置`i`，有两种选择。 

跳过位置：```
dp[i+1][k] = min(dp[i+1][k], dp[i][k])
```取发生间隔开始于`i`：```
dp[end[i]+1][k+1]
    = min(dp[end[i]+1][k+1],
          dp[i][k] + cost[i])
```直接跳转到`end[i]+1`保证所选事件是不相交的。 
5.完成所有转换后，`dp[n][k]`等于恰好需要的最小强制删除`k`发生。 
6. 将这些最小值转换为每个删除计数的答案。 

如果`dp[n][k] = d`， 然后：```
mandatory deletions = d
maximum deletions preserving k copies = n - k*m
```区间内的每次删除计数```
[d, n - k*m]
```是可以实现的。 

对于每个此类删除计数，将答案更新为`k`。 

### 为什么它有效

 每个选定的事件对应一个间隔，其内部必须清除匹配未使用的所有字符。 DP 明确累积这些强制删除，并通过跳过间隔末尾来禁止重叠。 

所选出现间隔之外的任何字符不会影响出现是否存在。 这些字符可以单独保留或删除。 因此，DP 只需要尽量减少强制删除即可。 一旦这些问题被修复，每个较大的删除都会增加`n - km`可以通过删除额外的外部字符来实现。 

DP 探索每组有效的非重叠发生间隔，并记录每个发生次数的最小强制删除成本。 这正是得出所有答案所需的数量。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

def solve():
    s = input().strip()
    p = input().strip()

    n = len(s)
    m = len(p)

    # next occurrence table
    nxt = [[n] * 26 for _ in range(n + 2)]

    for c in range(26):
        nxt[n][c] = n

    for i in range(n - 1, -1, -1):
        nxt[i] = nxt[i + 1][:]
        nxt[i][ord(s[i]) - 97] = i

    end = [-1] * n
    cost = [0] * n

    for i in range(n):
        if s[i] != p[0]:
            continue

        pos = i
        ok = True

        for j in range(1, m):
            pos = nxt[pos + 1][ord(p[j]) - 97]
            if pos == n:
                ok = False
                break

        if ok:
            end[i] = pos
            cost[i] = (pos - i + 1) - m

    INF = 30000

    dp = [array('H', [INF]) * (n + 1) for _ in range(n + 1)]
    dp[0][0] = 0

    for i in range(n):
        cur = dp[i]
        nxt_row = dp[i + 1]

        for k in range(n + 1):
            val = cur[k]
            if val == INF:
                continue

            if val < nxt_row[k]:
                nxt_row[k] = val

            if end[i] != -1:
                r = end[i] + 1
                nv = val + cost[i]
                if nv < dp[r][k + 1]:
                    dp[r][k + 1] = nv

    min_del = dp[n]

    ans = [0] * (n + 1)

    for k in range(n + 1):
        d = min_del[k]
        if d == INF:
            continue

        max_del = n - k * m
        if max_del < d:
            continue

        for x in range(d, max_del + 1):
            if k > ans[x]:
                ans[x] = k

    print(*ans)

solve()
```下一个出现表允许我们找到子序列匹配的最早结束位置`O(m)`每个起始位置的时间。 由于最多有 2000 个启动`m ≤ 500`，这个预处理成本`O(nm)`。 

DP 存储最少的强制删除。 跳转自`i`直接到`end[i] + 1`是防止重叠的机制。 两次出现永远不能共享字符，因为第二次出现在第一个间隔结束后被迫开始。 

最后的转换步骤是许多不正确的解决方案失败的地方。 知道最小删除量`k`发生次数还不够。 我们还必须尊重上限`n - km`，因为每次出现都需要`m`幸存的角色。 

## 工作示例

 ### 示例 1

 输入：```
s = "aaaaa"
p = "aa"
```发生间隔为：

 | 开始| 结束 | 成本|
 | --- | --- | --- |
 | 0 | 1 | 0 |
 | 1 | 2 | 0 |
 | 2 | 3 | 0 |
 | 3 | 4 | 0 |

 主要 DP 状态：

 | 位置 | 事件 | 最小强制删除 |
 | --- | --- | --- |
 | 0 | 0 | 0 |
 | 2 | 1 | 0 |
 | 4 | 2 | 0 |
 | 5 | 2 | 0 |

 民主党发现：

 | k | 最小德尔[k] |
 | --- | --- |
 | 0 | 0 |
 | 1 | 0 |
 | 2 | 0 |

 为了`k = 2`，可达到的删除范围为：```
[0, 5 - 2*2] = [0, 1]
```所以删除很重要`0`和`1`仍然可以保留两次出现。 

最终输出：```
2 2 1 1 0 0
```此示例显示允许出现间隔之外的额外删除。 

### 示例 2

 输入：```
s = "abca"
p = "aa"
```发生间隔：

 | 开始| 结束 | 成本|
 | --- | --- | --- |
 | 0 | 3 | 2 |

 间隔长度为4，而模式长度为2，因此必须删除两次。 

DP结果：

 | k | 最小德尔[k] |
 | --- | --- |
 | 0 | 0 |
 | 1 | 2 |

 对于一次出现：```
deletion range = [2, 4 - 2] = [2, 2]
```只有恰好两次删除才能保留一份副本`"aa"`。 

答案变成：```
0 0 1 0 0
```这说明了为什么仅仅检查是否`minDel[k] ≤ x`是不够的。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(n² + nm)`| DP 是`O(n²)`，区间构造为`O(nm)`|
 | 空间|`O(n²)`| DP尺寸表`(n+1) × (n+1)`|

 和`n ≤ 2000`，DP 执行大约 400 万次状态更新，完全符合限制。 内存使用量也保持在 256 MB 限制内。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io
from array import array

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    s = input().strip()
    p = input().strip()

    n = len(s)
    m = len(p)

    nxt = [[n] * 26 for _ in range(n + 2)]
    for i in range(n - 1, -1, -1):
        nxt[i] = nxt[i + 1][:]
        nxt[i][ord(s[i]) - 97] = i

    end = [-1] * n
    cost = [0] * n

    for i in range(n):
        if s[i] != p[0]:
            continue

        pos = i
        ok = True

        for j in range(1, m):
            pos = nxt[pos + 1][ord(p[j]) - 97]
            if pos == n:
                ok = False
                break

        if ok:
            end[i] = pos
            cost[i] = (pos - i + 1) - m

    INF = 30000
    dp = [array('H', [INF]) * (n + 1) for _ in range(n + 1)]
    dp[0][0] = 0

    for i in range(n):
        for k in range(n + 1):
            v = dp[i][k]
            if v == INF:
                continue

            if v < dp[i + 1][k]:
                dp[i + 1][k] = v

            if end[i] != -1:
                r = end[i] + 1
                nv = v + cost[i]
                if nv < dp[r][k + 1]:
                    dp[r][k + 1] = nv

    ans = [0] * (n + 1)

    for k in range(n + 1):
        d = dp[n][k]
        if d == INF:
            continue

        mx = n - k * m
        if mx < d:
            continue

        for x in range(d, mx + 1):
            ans[x] = max(ans[x], k)

    return " ".join(map(str, ans))

# provided sample
assert run("aaaaa\naa\n") == "2 2 1 1 0 0"

# minimum size
assert run("a\na\n") == "1 0"

# pattern impossible
assert run("abc\nd\n") == "0 0 0 0"

# exact deletion bound
assert run("aa\naa\n") == "1 0 0"

# subsequence but not substring
assert run("abca\naa\n") == "0 0 1 0 0"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`a / a`|`1 0`| 最小有效输入|
 |`abc / d`|`0 0 0 0`| 无法形成图案 |
 |`aa / aa`|`1 0 0`| 删除上限`n - km`|
 |`abca / aa`|`0 0 1 0 0`| 强制删除的子序列匹配 |

 ## 边缘情况

 考虑：```
aa
aa
```DP 发现一处具有强制删除成本的事件`0`。 保留该事件的最大删除计数也是`0`，因为两个字符都是必需的。 可达到的范围是`[0, 0]`。 对于删除计数`1`，答案正确变为`0`。 

现在考虑：```
abca
aa
```最早发生间隔为`[0, 3]`。 它的长度是`4`，而图案长度为`2`，所以两次删除是不可避免的。 DP记录`minDel[1] = 2`。 自从`n - km = 2`，一次出现的唯一可实现的删除计数恰好是`2`。 

最后：```
aaaaa
aa
```有许多重叠的方式来选择出现。 DP 决不允许重叠，因为选择一个间隔会直接跳转到其结束后的位置。 两个选定的出现始终是不相交的，符合最终字符串中不重叠副本的问题要求。
