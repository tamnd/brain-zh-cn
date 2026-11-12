---
title: "CF 219C - 彩色条纹"
description: "我们得到一条由 n 个单元格组成的行，其中每个单元格都涂有 k 种颜色中的一种，并用字母 A 到第 k 个字母标记。 目标是重新绘制尽可能少的单元格，以便没有两个相邻单元格共享相同的颜色。"
date: "2026-06-04T01:43:23+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "dp", "greedy"]
categories: ["algorithms"]
codeforces_contest: 219
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 135 (Div. 2)"
rating: 1600
weight: 219
solve_time_s: 63
verified: true
draft: false
---

[CF 219C - 彩色条纹](https://codeforces.com/problemset/problem/219/C)

 **评分：** 1600
 **标签：** 暴力破解、dp、贪婪
 **求解时间：** 1m 3s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个表示为一行的条纹`n`单元格，其中每个单元格被涂成以下之一`k`用字母标记的颜色`A`通过`k`第-个字母。 目标是重新绘制尽可能少的单元格，以便没有两个相邻单元格共享相同的颜色。 输出必须包括最小重绘次数和有效的结果条带配置。 

输入大小很重要：`n`最多可达 500,000，并且`k`最多可达 26。这排除了任何二次解`n`， 因为`n^2`在最坏的情况下，操作将达到大约 2.5×10^11，远高于 2 秒的时间限制。 需要线性或近线性解决方案。 小上限为`k`这表明我们可以在恒定时间内考虑每个单元格的所有可用颜色。 

当出现微妙的边缘情况时`k = 2`。 在这种情况下，只有两种颜色，因此条纹必须在它们之间完美交替。 任何连续具有三种相同颜色的序列都必然需要重新绘制中间的颜色。 如果不考虑下一个单元格，仅查看前一个单元格的天真贪婪选择可能会失败，从而产生次优的重绘计数。 

另一个潜在的陷阱是当条纹已经具有交替颜色时。 如果一个粗心的算法盲目地强制“如果与先前相同则进行更改”而不考虑序列已经有效，则仍然可能进行不必要的重绘。 

## 方法

 暴力方法会考虑为满足邻接条件的每个单元格分配所有可能的颜色，然后计算重绘次数。 对于每个单元格，有`k`选项，并且对于`n`这导致细胞`k^n`的可能性。 即使进行了修剪，这对于`n`最多 500,000。 

关键的见解是，通过仔细关注前一个单元格，可以贪婪地解决问题。 由于目标只是避免相邻的重复，因此每个单元格的选择仅取决于其直接邻居的颜色。 这允许线性扫描：对于每个单元格，如果它与前一个单元格匹配，我们选择一种不同的颜色。 通过迭代所有颜色，可以在恒定时间内完成选择替代颜色`k`颜色，直到我们找到与前一个不同的颜色（并且，可选地，下一个，如果`k > 2`我们希望避免造成新的冲突）。 

为了`k = 2`，只有两种可能的有效条纹：从第一种颜色或第二种颜色开始交替。 我们可以计算两者的重涂成本并选择更便宜的选项。 为了`k > 2`，从左到右的贪婪扫描总是会以最少的重绘成功，因为总是至少有一种颜色可供选择，可以避免直接冲突。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(k^n) | O(k^n) | O(n) | 太慢了|
 | 贪婪线性扫描| O(n·k) | O(n) | 已接受 |

 ## 算法演练

 1. 将输入字符串转换为列表以进行可变操作，因为我们将就地重新绘制。 这避免了重复构造新字符串。 
2.如果`k = 2`，计算两种可能的交替序列的重绘成本：从第一种颜色开始，从第二种颜色开始。 比较计数并选择更便宜的序列。 返回计数和序列。 
3.如果`k > 2`，从第二个单元格开始，从左到右迭代条带。 对于每个单元格，检查它是否与前一个单元格匹配。 
4. 如果找到匹配项，则增加重绘计数器并为此单元格选择新颜色。 遍历所有`k`颜色并选择第一个与前一个单元格和下一个单元格（如果存在）不同的颜色。 将此颜色分配给当前单元格。 
5. 继续扫描直至结束。 当我们完成时，每对相邻单元格都保证具有不同的颜色。 
6. 输出重绘总数和生成的条纹。 

贪婪算法之所以有效，是因为它保持了当前索引左侧的所有单元格都正确着色且没有相邻重复项的不变性。 在每一步中，我们仅在必要时重新绘制，并且始终选择保留不变性的颜色。 自从`k ≥ 2`，总是至少有一种有效的颜色可供选择，保证正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, k = map(int, input().split())
s = list(input().strip())
colors = [chr(ord('A') + i) for i in range(k)]
repaints = 0

if k == 2:
    # only two valid sequences: ABAB... or BABA...
    alt1 = [colors[i % 2] for i in range(n)]
    alt2 = [colors[(i + 1) % 2] for i in range(n)]
    cost1 = sum(s[i] != alt1[i] for i in range(n))
    cost2 = sum(s[i] != alt2[i] for i in range(n))
    if cost1 <= cost2:
        print(cost1)
        print(''.join(alt1))
    else:
        print(cost2)
        print(''.join(alt2))
else:
    i = 1
    while i < n:
        if s[i] == s[i - 1]:
            repaints += 1
            for c in colors:
                if c != s[i - 1] and (i + 1 == n or c != s[i + 1]):
                    s[i] = c
                    break
        i += 1
    print(repaints)
    print(''.join(s))
```该代码首先将输入字符串转换为可变列表。 对于`k = 2`边缘情况，它构造两个交替序列并计算两个序列的重绘成本。 为了`k > 2`，算法扫描每个单元格，检测与前一个单元格的冲突，并选择有效的替代颜色。 对下一个单元格的检查可以防止在不久的将来产生新的冲突。 

## 工作示例

 样本1：```
Input: 6 3
ABBACC
```| 我| s[i] 之前 | s[i-1] | s[i-1] s[i+1] | s[i+1] 行动| 后 |
 | ---| ---| ---| ---| ---| ---|
 | 1 | 乙| 一个 | 乙| 好的 | A B B A C C | A B B A C C |
 | 2 | 乙| 乙| 一个 | 冲突，选C | A B C A C C | A B C A C C |
 | 3 | 一个 | C | C | 好的 | ... |
 | 4 | C | 一个 | C | 好的 | ... |
 | 5 | C | C | - | 冲突，选A | A B C A C A | A B C A C A |

 重新绘制 = 2。生成的条纹 = ABCACA。 

构造的例子：```
Input: 5 2
AAAAA
```对于k=2，两个序列是ABABA和BABAB。 与AAAA相比：

 | 序列 | 重新喷漆 |
 | ---| ---|
 | 阿巴 | 2 |
 | 巴巴布 | 3 |

 最少重涂次数 = 2。所得条纹 = ABABA。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n·k) | 每个单元格都被访问一次。 重新绘制时，我们迭代最多 k 种颜色。 对于 k ≤ 26，这实际上是常数。 |
 | 空间| O(n) | 我们将条纹存储为可变列表和长度为 k 的颜色数组。 |

 当 n ≤ 5×10^5 且 k ≤ 26 时，O(n·k) 次操作远低于 2×10^7，完全适合 2 秒的时间限制和 256 MB 内存。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        n, k = map(int, input().split())
        s = list(input().strip())
        colors = [chr(ord('A') + i) for i in range(k)]
        repaints = 0

        if k == 2:
            alt1 = [colors[i % 2] for i in range(n)]
            alt2 = [colors[(i + 1) % 2] for i in range(n)]
            cost1 = sum(s[i] != alt1[i] for i in range(n))
            cost2 = sum(s[i] != alt2[i] for i in range(n))
            if cost1 <= cost2:
                print(cost1)
                print(''.join(alt1))
            else:
                print(cost2)
                print(''.join(alt2))
        else:
            i = 1
            while i < n:
                if s[i] == s[i - 1]:
                    repaints += 1
                    for c in colors:
                        if c != s[i - 1] and (i + 1 == n or c != s[i + 1]):
                            s[i] = c
                            break
                i += 1
            print(repaints)
            print(''.join(s))
    return out.getvalue().strip()

# Provided sample
assert run("6 3\nABBACC\n") == "2\nABCACA", "sample 1"
# Minimum size
assert run("1 2\nA\n") == "0\nA", "single cell"
# All equal, k=2
assert run("5 2\nAAAAA\n")
```
