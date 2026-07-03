---
title: "CF 103637B - BSUIR 开放 X"
description: "我们得到一个字符串集合，每个字符串代表一个任务集的代码名称。 从这个集合中，我们必须恰好选择两个不同的字符串，并且我们可以按任意顺序放置它们，将它们一个接一个地连接起来。"
date: "2026-07-02T22:18:48+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103637
codeforces_index: "B"
codeforces_contest_name: "2019-2020 10th BSUIR Open Programming Championship. Semifinal"
rating: 0
weight: 103637
solve_time_s: 52
verified: true
draft: false
---

[CF 103637B - BSUIR Open X](https://codeforces.com/problemset/problem/103637/B)

 **评级：** -
 **标签：** -
 **求解时间：** 52s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个字符串集合，每个字符串代表一个任务集的代码名称。 从这个集合中，我们必须恰好选择两个不同的字符串，并且我们可以按任意顺序放置它们，将它们一个接一个地连接起来。 

目标是计算有多少有序的不同索引对在串联后产生目标字符串“BSUIROPENX”。 独特性是由索引定义的，而不是由字符串值定义的，因此如果两个相同的字符串出现在不同的位置，它们将被视为不同的选择。 

关键限制是输入的大小：最多 100,000 个字符串，总长度最多 1,000,000。 这立即排除了任何尝试直接测试所有字符串对的解决方案，因为这将是字符串数量的二次方，并且远远超出可行的限制。 即使是每次比较都是 O(1) 的 O(n²) 检查，在最坏的情况下也已经是大约 1010 次操作。 

更微妙的约束来自目标字符串长度，它是固定的且很小（10 个字符）。 这暗示只有有助于形成这个确切字符串的字符串才是相关的，其他所有内容都可以忽略。 

常见的失败情况是假设我们需要任意对之间的子串匹配或重叠匹配。 例如，如果尝试为每一对动态匹配后缀和前缀，则很容易过度计数或错过分割点受精确相等而不是部分匹配约束的情况。 

当存在多个相同的字符串时，就会出现具体的陷阱。 例如，如果列表包含三个“BSU”副本和两个“IROPENX”副本，则答案不是 3 + 2，而是 3 × 2 加上相反的可能性（如果适用）。 许多不正确的解决方案忘记了排序使贡献加倍，并且相同的字符串仍然必须被视为不同的索引。 

## 方法

 暴力方法将迭代所有有序的字符串对，并检查它们的串联是否等于“BSUIROPENX”。 每次检查的成本为 O(L)，其中 L 最多为 10，并且有 O(n²) 对。 当 n 达到 10⁵ 时，这会导致大约 10^10 次比较，这太慢了。 

关键的观察是我们实际上不需要考虑任意串联。 由于目标字符串是固定的，任何有效的对都必须对应于“BSUIROPENX”内的分割点。 这意味着我们可以将目标分成两部分，并查找一个等于前缀的字符串，另一个等于后缀的字符串。 

令目标为 T =“BSUIROPENX”。 对于从 1 到 9 的每个分割位置 i，我们考虑 T[0:i] 和 T[i:]。 任何有效的有序对必须由一个等于 T[0:i] 的字符串和另一个等于 T[i:] 的字符串组成。 这减少了字符串频率计数的问题。 

我们简单地计算每个字符串在输入中出现的次数，然后将所有有效分割点的频率乘积相加。 我们还必须自动尊重排序：前缀第一和后缀第二已经定义了方向，如果问题需要两个串联顺序，我们会单独考虑反向排序（事实确实如此）。 因此，对于每个分割，当前缀和后缀不同时，我们添加 freq(prefix) × freq(suffix) 和 freq(suffix) × freq(prefix)，而当它们相等时，仅添加 freq(prefix) × (freq(prefix) − 1)。 

这减少了线性扫描字符串和固定长度目标上持续工作的问题。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n²·L) | O(1) | O(1) | 太慢了|
 | 频率+分割枚举| O(n + | T | ) |

 ## 算法演练

 令目标字符串为 T = “BSUIROPENX”。

1. 读取所有输入字符串并构建频率图。 每个不同的字符串存储它出现的次数。 这允许稍后进行恒定时间查找，而不是重复扫描。 
2. 迭代从 1 到 len(T) − 1 的所有可能的分割位置 i。每个分割定义前缀 A = T[0:i] 和后缀 B = T[i:]。 
3. 对于每个分割，检查频率图中是否同时存在 A 和 B。 如果其中一个缺失，则完全跳过此拆分，因为无法形成有效的对。 
4. 如果 A 和 B 是不同的字符串，则在答案中添加 freq[A] × freq[B] × 2。 因子 2 考虑了两种可能的顺序：A 后跟 B，B 后跟 A。 
5. 如果 A 和 B 是同一个字符串，则添加 freq[A] × (freq[A] − 1)。 这对从相同字符串中选择的不同索引的有序对进行计数，因为排序仍然很重要，但我们必须避免将索引与其自身配对。 
6. 累加所有分割点的结果并输出最终的总和。 

### 为什么它有效

 每个有效的串联都等于目标字符串。 因此，两个所选字符串之间的边界必须与目标的内部切割位置之一精确对齐。 不可能有其他结构，因为字符串连接可以保持顺序，没有重叠或间隙。 这将整个问题空间从任意字符串配对减少到最多 9 个候选分割的有限集。 基于频率的计数确保每个有效索引对根据是否对应于前缀后缀分割而被精确计数一次。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input().strip())
    freq = {}

    for _ in range(n):
        s = input().strip()
        freq[s] = freq.get(s, 0) + 1

    target = "BSUIROPENX"
    ans = 0

    m = len(target)

    for i in range(1, m):
        a = target[:i]
        b = target[i:]

        ca = freq.get(a, 0)
        cb = freq.get(b, 0)

        if ca == 0 or cb == 0:
            continue

        if a != b:
            ans += ca * cb * 2
        else:
            ans += ca * (ca - 1)

    print(ans)

if __name__ == "__main__":
    solve()
```该解决方案首先将输入压缩到频率表中，以便重复的字符串不需要重复扫描。 然后，目标字符串的每个分割都被视为有关如何形成最终连接的结构假设。 相等和不相等一半的处理至关重要，因为它决定有序对是来自两个不同的组还是来自单个组。 

不同部分乘以 2 很容易被忽略，但它直接对应了两个串联顺序都是有效的并且必须单独计算的事实。 

## 工作示例

 ### 示例 1

 输入：```
4
BSUIR
BSU
OPEN
IROPENX
```目标是“BSUIROPENX”。 我们计算频率：

 | 字符串| 频率 |
 | ---| ---|
 | BSUIR | 1 |
 | 白俄罗斯州立大学 | 1 |
 | 打开| 1 |
 | IROPENX | 1 |

 现在我们检查分割：

 | 分割我| 前缀 | 后缀 | 频率[前缀] | 频率[后缀] | 贡献 |
 | ---| ---| ---| ---| ---| ---|
 | 3 | 白俄罗斯州立大学 | IROPENX | 1 | 1 | 2 |

 其他分割与输入中的任何字符串都不匹配。 

最终答案是 2，对应于 (BSU, IROPENX) 的两种排序。 

这证实了排序计算正确，并且只有精确的前缀后缀匹配才是重要的。 

### 示例 2

 输入：```
3
BSUIR
OPENX
BSUIROPENX
```目标拆分包括 BSUIR + OPENX，但 OPENX 存在且 BSUIR 存在。 

| 分割我| 前缀 | 后缀 | 频率[前缀] | 频率[后缀] | 贡献 |
 | ---| ---| ---| ---| ---| ---|
 | 5 | BSUIR | OPENX | 1 | 1 | 2 |

 答案是 2，再次反映两个串联顺序。 

这表明，即使输入中的字符串不相邻，频率计数也能正确捕获所有有效配对。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n + | T |
 | 空间| O(n) | 输入字符串频率图的存储 |

 这些约束允许最多 10⁵ 字符串和总长度 10⁶，因此使用散列的线性时间解决方案完全在限制范围内。 目标字符串的大小是恒定的，因此拆分枚举可以忽略不计。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from sys import stdout
    old = sys.stdout
    sys.stdout = io.StringIO()

    solve()

    out = sys.stdout.getvalue()
    sys.stdout = old
    return out.strip()

def solve():
    n = int(input().strip())
    freq = {}
    for _ in range(n):
        s = input().strip()
        freq[s] = freq.get(s, 0) + 1

    target = "BSUIROPENX"
    ans = 0
    m = len(target)

    for i in range(1, m):
        a = target[:i]
        b = target[i:]
        ca = freq.get(a, 0)
        cb = freq.get(b, 0)

        if ca == 0 or cb == 0:
            continue

        if a != b:
            ans += ca * cb * 2
        else:
            ans += ca * (ca - 1)

    print(ans)

# provided sample
assert run("4\nBSUIR\nBSU\nOPEN\nIROPENX\n") == "2"

# single valid pair
assert run("2\nBSUIR\nOPENX\n") == "2"

# no solution
assert run("3\nA\nB\nC\n") == "0"

# duplicates
assert run("4\nBSU\nBSU\nIROPENX\nIROPENX\n") == "8"

# all equal strings irrelevant
assert run("3\nBSU\nBSU\nBSU\n") == "0"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 样品| 2 | 基本正确性 |
 | 2 弦 | 2 | 两个订单均已计算 |
 | 没有匹配| 0 | 安全拒绝|
 | 重复 | 8 | 多重性处理 |
 | 不相关的重复| 0 | 过滤不匹配的字符串|

 ## 边缘情况

 一种重要的边缘情况是前缀和后缀相同。 如果输入包含此类字符串的多个副本，我们必须对有序对进行计数，而不将索引与其自身配对。 公式 freq × (freq − 1) 正确地处理了这个问题。 

例如，如果目标分割产生 A = B = "XX" 并且输入包含 3 次出现的 "XX"，则有效的有序对为 (i, j)，其中 i ≠ j，即 3 × 2 = 6。 

另一种边缘情况是目标的多个分割对应于有效字符串。 每个分裂都是独立的，因此贡献会累积。 频率图确保每个有效对每次分割都精确计数一次，并且分割之间没有重叠会导致超出预期排序对称性的重复计数。
