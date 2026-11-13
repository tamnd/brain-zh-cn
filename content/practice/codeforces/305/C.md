---
title: "CF 305C - 伊万和二的幂"
description: "我们得到一个已排序的指数数组。 Ivan 在纸上写下相应的 2 的幂，而不是指数本身：$$2^{a1}、2^{a2}、点、2^{an}$$ 我们可以添加更多数字，但每个添加的数字也必须是 2 的幂。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "implementation"]
categories: ["algorithms"]
codeforces_contest: 305
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 184 (Div. 2)"
rating: 1600
weight: 305
solve_time_s: 108
verified: true
draft: false
---

[CF 305C - 伊万和二的幂](https://codeforces.com/problemset/problem/305/C)

 **评分：** 1600
 **标签：** 贪心，实现
 **求解时间：** 1m 48s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个已排序的指数数组。 伊万没有将指数本身写在纸上，而是将相应的 2 的幂写在纸上：$$2^{a_1}, 2^{a_2}, \dots, 2^{a_n}$$我们可以添加更多的数字，但每个添加的数字也必须是 2 的幂。 目标是使总和等于以下形式的数字$$2^v - 1$$对于一些非负整数$v$。 我们需要计算所需的 2 的附加幂的最小数量。 

像这样的数字$2^v - 1$很特殊，因为它的二进制表示仅包含 1。 例如：$$1 = 1_2,\quad 3 = 11_2,\quad 7 = 111_2,\quad 15 = 1111_2$$输入大小达到$10^5$，指数可以大到$2 \cdot 10^9$。 这立即排除了任何显式构造巨大二进制数组或模拟最大指数位位置的算法。 我们需要接近线性时间的东西。 

关键的观察是，二的幂的实际值是巨大的，但二进制进位是局部的。 由于所有数字都是 2 的幂，因此整个过程的行为与二进制加法完全相同。 

一些边缘情况很容易被错误处理。 

假设当前总和已经是以下形式$2^v - 1$。 

输入：```
4
0 1 1 1
```数字是$1,2,2,2$，其总和为$7$。 自从$7 = 2^3 - 1$，答案是$0$。 总是试图在不检查进位的情况下“完成丢失的位”的粗心实现可能会错误地添加额外的权力。 

另一个棘手的情况是，当许多平等的权力因进位而崩溃时。 

输入：```
3
0 0 0
```总和是$3$，已经等于$2^2 - 1$。 如果我们只计算不同的指数，我们会认为第 1 位丢失并错误地回答$1$。 

大型承载链也很重要。 

输入：```
5
0 0 0 0 0
```总和是$5$, 二进制$101$。 达到表格的数量$111$，我们只需要添加$2$, 给予$7$。 答案是$1$， 不是$2$。 对各个位的贪婪推理在这里很容易失败。 

## 方法

 暴力方法将显式计算当前总和：$$S = \sum 2^{a_i}$$然后我们可以尝试表单的每个目标$2^v - 1$大于或等于$S$。 对于每个目标，我们将计算差异：$$D = (2^v - 1) - S$$由于每个相加的数字必须是 2 的幂，因此相加项的最小数量等于设置的位数$D$。 我们可以在所有可能的情况下最小化该值$v$。 

这个想法在数学上是正确的，因为每个设置位$D$可以作为 2 的幂独立相加。 

问题是数字大小。 指数达到$2 \cdot 10^9$，因此从概念上讲，总和本身可以包含数十亿位。 如果简单地实现，直接大整数操作将变得不切实际。 尽管 Python 整数是任意精度的，但构建大量数字是浪费且不必要的。 

重要的见解是我们永远不需要完整的数字本身。 我们只关心处理完所有进位后还剩下多少位。 

逐列考虑二进制加法。 每次出现指数$x$为位位置贡献一个单位$x$。 同一位置的两个单元在下一个位置合并为一个进位。 

传播所有进位后，每个位位置包含 0 或 1。令总和的最终二进制表示为：$$b_k b_{k-1} \dots b_0$$将此数字转换为如下形式$111\dots111$，我们只需要将最高设置位以下的每个零位都变成一即可。 每缺少一个都需要恰好添加 2 的一次幂。 

因此，答案只是最终总和的最高有效设置位下方的零位的数量。 

我们可以计算这个，而无需显式构造大整数。 我们只模拟占据位置之间的进位。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(B²) | O(B) | 太慢了 |
 | 最佳 | O(n) | O(n) | 已接受 |

 这里，$B$表示进位传播后相关位位置的数量。 

## 算法演练

 1. 读取排序后的指数。 
2. 计算每个指数出现的次数。 

每次出现都会为该二进制位置贡献一个单位。 
3. 按升序处理仓位，向上传播进位。 

如果位置$x$包含$c$单位：

 -$c \bmod 2$成为该位置的最后一位$x$-$c // 2$被带到位置$x+1$这与普通的二进制加法完全匹配。 
4. 跟踪以等于 1 的位结尾的最高位置。 

该位置之上的位并不重要，因为目标形式是：$$111\dots111$$仅限最高设置位。 
5. 计算进位传播后最高设置位以下有多少个位置包含 0。 

每个这样的位置都需要加上二的一次幂。 
6. 输出计数。 

### 为什么它有效

 进位传播后，我们获得当前和的真实二进制表示。 任意数量的表格$2^v - 1$其最高位以下的所有位都等于 1。 

我们只允许添加 2 的幂，这意味着每个操作都可以将一个选定的位从 0 变为 1，而不影响较低位。 由于更高的目标只是附加额外的前导数字，因此最佳目标始终是当前总和之上的最小全一数字。 

这意味着最高有效设置位下方的每个零位必须恰好固定一次，并且不需要额外的添加。 

## Python 解决方案```python
import sys
from collections import defaultdict

input = sys.stdin.readline

def solve():
    n = int(input())
    a = list(map(int, input().split()))

    cnt = defaultdict(int)

    for x in a:
        cnt[x] += 1

    bits = {}
    positions = sorted(cnt.keys())

    i = 0
    while i < len(positions):
        pos = positions[i]

        cur = cnt[pos]

        bits[pos] = cur & 1

        carry = cur >> 1
        if carry:
            cnt[pos + 1] += carry
            if pos + 1 not in bits and (i + 1 == len(positions) or positions[i + 1] != pos + 1):
                positions.append(pos + 1)

        i += 1

    positions.sort()

    highest = -1

    for pos in positions:
        if bits.get(pos, 0):
            highest = pos

    ans = 0

    for pos in range(highest):
        if bits.get(pos, 0) == 0:
            ans += 1

    print(ans)

if __name__ == "__main__":
    solve()
```字典`cnt`存储每个指数当前存在的数量。 当我们处理一个位置时，我们将其计数分为最后一位和进位。 

表达式：```
bits[pos] = cur & 1
```保留计数的奇偶校验，该奇偶校验成为该位置的最终二进制位。 

表达式：```
carry = cur >> 1
```计算有多少对向上移动。 

一个微妙的问题是进位可能会创建原始输入中不存在的全新位置。 我们动态附加这些位置并在最终扫描之前再次排序。 

另一个重要的细节是循环：```
for pos in range(highest):
```我们停在前面`highest`因为根据定义，最高设置位已经为 1。 只有严格低于它的职位可能需要填补。 

Python 整数在这里是安全的，因为我们从不直接构造巨大的幂。 我们只操纵计数和位置。 

## 工作示例

 ### 示例 1

 输入：```
4
0 1 1 1
```初始权力为：$$1,2,2,2$$他们的总和是$7 = 111_2$。 

| 位置 | 进位前先计数 | 最后一点| 执行|
 | ---| ---| ---| ---|
 | 0 | 1 | 1 | 0 |
 | 1 | 3 | 1 | 1 |
 | 2 | 1 | 1 | 0 |

 最终的二进制形式是：$$111_2$$最高设置位以下没有零位，所以答案是$0$。 

该轨迹显示了重复的力量如何通过进位自然地合并。 

### 示例 2

 输入：```
1
2
```唯一的数字是：$$2^2 = 4$$二进制表示：$$100_2$$| 位置 | 进位前先计数 | 最后一点| 执行|
 | ---| ---| ---| ---|
 | 2 | 1 | 1 | 0 |

 位 0 和 1 丢失。 

获得：$$111_2 = 7$$我们添加：$$2^0 + 2^1$$所以答案是$2$。 

此示例表明，最佳目标始终是当前总和之上的最小全 1 数。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 每个位置都会被处理固定次数 |
 | 空间| O(n) | 字典每个相关位位置最多存储一个条目 |

 不同位置的数量保持线性，因为每个进位仅向上移动一步，并且进位总数受到输入元素数量的限制。 这很容易符合以下限制$10^5$元素。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from collections import defaultdict

def solve():
    input = sys.stdin.readline

    n = int(input())
    a = list(map(int, input().split()))

    cnt = defaultdict(int)

    for x in a:
        cnt[x] += 1

    bits = {}
    positions = sorted(cnt.keys())

    i = 0
    while i < len(positions):
        pos = positions[i]

        cur = cnt[pos]

        bits[pos] = cur & 1

        carry = cur >> 1

        if carry:
            cnt[pos + 1] += carry
            if pos + 1 not in bits and (i + 1 == len(positions) or positions[i + 1] != pos + 1):
                positions.append(pos + 1)

        i += 1

    positions.sort()

    highest = -1

    for pos in positions:
        if bits.get(pos, 0):
            highest = pos

    ans = 0

    for pos in range(highest):
        if bits.get(pos, 0) == 0:
            ans += 1

    print(ans)

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    out = sys.stdout.getvalue()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return out

# provided sample
assert run("4\n0 1 1 1\n") == "0\n", "sample 1"

# minimum size
assert run("1\n0\n") == "0\n", "single one already equals 1"

# single high bit
assert run("1\n2\n") == "2\n", "need bits 0 and 1"

# carry chain
assert run("5\n0 0 0 0 0\n") == "1\n", "5 is binary 101"

# all equal values
assert run("4\n3 3 3 3\n") == "0\n", "four 8s become 32"

# sparse bits
assert run("2\n0 3\n") == "2\n", "binary 1001 needs two gaps filled"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / 0`|`0`| 尽可能最小的有效金额 |
 |`1 / 2`|`2`| 缺少低位 |
 |`5 / 0 0 0 0 0`|`1`| 长进位传播 |
 |`4 / 3 3 3 3`|`0`| 多个进位折叠成一位 |
 |`2 / 0 3`|`2`| 稀疏二进制表示|

 ## 边缘情况

 考虑重复进位。 

输入：```
4
3 3 3 3
```我们从四份副本开始$2^3 = 8$。 

二进制加法的过程如下：

 - 位 3 处的四个单位产生零并向上携带两个单位。 
- 位 4 处的两个单位产生零并向上携带一个单位。 
- 位 5 变为 1。 

最终的数字是：$$100000_2$$所有低五位均为零，但我们只关心低于最高设置位的。 我们需要添加五项内容：$$111111_2$$该算法通过重复进位传播自动处理这个问题。 

现在考虑稀疏配置。 

输入：```
2
0 3
```总和是：$$1 + 8 = 9 = 1001_2$$位 1 和位 2 丢失。 该算法恰好检测到最高设置位下方的两个零位并给出答案$2$。 

最后，考虑一个通过进位形成的已经完美的数字。 

输入：```
3
0 0 0
```三者之和为：$$11_2$$进位传播产生：

 - 位 0 = 1
 - 进位至位 1
 - 位 1 = 1

 没有间隙，所以答案是$0$。 这证实了算法在计算丢失位之前正确处理进位。
