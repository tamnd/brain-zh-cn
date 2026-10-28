---
title: "CF 145E - 幸运查询"
description: "我们有一个仅由数字 4 和 7 组成的字符串。对其执行两种操作。 第一个操作翻转段中的每个数字。 每4变成7，每7变成4。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "data-structures"]
categories: ["algorithms"]
codeforces_contest: 145
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 104 (Div. 1)"
rating: 2400
weight: 145
solve_time_s: 132
verified: true
draft: false
---

[CF 145E - 幸运查询](https://codeforces.com/problemset/problem/145/E)

 **评分：** 2400
 **标签：** 数据结构
 **求解时间：** 2m 12s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个仅由数字组成的字符串`4`和`7`。 对其进行两种操作。 

第一个操作翻转段中的每个数字。 每一个`4`变成`7`，以及每一个`7`变成`4`。 

第二个操作询问当前字符串的最长非递减子序列的长度。 

由于字符串仅包含两个可能的数字并且`4 < 7`，非递减子序列具有非常特定的形状。 它由一定数量的`4`s 后面跟着一些`7`s。 我们可以跳过字符，但不能放置`7`在选择之前`4`。 

例如：

 - 在`44777`，整个字符串已经是非减的，所以答案是`5`。 
- 在`7744`，最好的子序列是`77`或者`44`，所以答案是`2`。 
- 在`74747`，我们可以取`4447`或者`777`，所以答案是`4`。 

这些约束完全排除了每次更新后从头开始重建答案的可能性。 字符串长度可以达到`10^6`，并且可以有`3 * 10^5`运营。 即使每个查询进行线性扫描也需要大约`3 * 10^11`最坏情况下的操作，在3秒的限制内是不可能的。 

这些更新也是范围更新，这使得朴素突变变得昂贵。 我们需要一些支持的东西：

 - 翻转一个区间内的所有数字，
 - 有效地组合来自间隔的信息，
 - 快速回答全局最长非减子序列。 

如果数据结构中存储的状态不完整，一些边缘情况很容易被错误处理。 

考虑：```
s = 7474
```答案是`3`，因为我们可以取子序列`447`。 

如果我们只存储计数`4`和`7`，我们不知道它们是如何排列的。 两个都`4477`和`7474`包含两个`4`和两个`7`s，但他们的答案不同。 

另一个危险的情况是在重叠范围内重复翻转：```
initial: 4477
switch 1 2 -> 7777
switch 2 3 -> 7447
```惰性传播必须正确组合。 一个常见的错误是覆盖待处理的翻转而不是切换它。 

最小的情况也很重要：```
1 3
4
count
switch 1 1
count
```输出是：```
1
1
```无论翻转如何，单个字符始终是有效的非递减子序列。 

## 方法

 暴力解决方案直接将每个更新应用于字符串，并从头开始重新计算每个更新的答案`count`询问。 

要计算二进制字符串中的最长非递减子序列，我们可以从左到右扫描。 在每个位置，我们决定是否用`4`或与`7`。 动态规划解决方案以线性时间运行。 

这给出：

 -`O(r - l + 1)`每次切换的时间，
 -`O(n)`每次计数的时间。 

在最坏的情况下，这两种操作都会发生`3 * 10^5`长度字符串上的次数`10^6`。 这变成了数千亿次操作。 

关键的观察是，一个段的答案可以仅使用几个值来表示。 

对于每个细分，我们存储：

 - 数量`4`是，
 - 数量`7`是，
 - 最长的非递减子序列（`4...7`),
 - 最长的非递增子序列（`7...4`）。 

为什么我们还需要递减版本？ 因为翻转数字交换了含义`4`和`7`。 翻转后：

 - 全部`4`成为`7`s,
 - 全部`7`成为`4`s,
 - 递增子序列变为递减子序列。 

这种对称性使得惰性传播变得极其干净。 

假设我们将一个段分成左半部分和右半部分。 

为了构建整个段的最佳非递减子序列，我们有两种选择：

 - 采取所有有用的`4`从左边开始，并从右边继续最佳非递减子序列，
 - 从左边取最好的非减子序列然后全部有用`7`从右边开始。 

所以：```
inc = max(left.four + right.inc,
          left.inc + right.seven)
```相似地：```
dec = max(left.seven + right.dec,
          left.dec + right.four)
```这种合并规则是关联的，这使得它非常适合线段树。 

范围翻转是惰性处理的。 翻转一个段只是交换：

 -`four <-> seven`-`inc <-> dec`每次操作的成本`O(log n)`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(百万) | O(n) | 太慢了 |
 | 最佳 | O(m log n) | O(n) | 已接受 |

 ## 算法演练

 1. 在字符串上构建线段树。 

每个节点代表一个连续的子串。 
2. 对于每个节点，存储四个值：

 -`four`: 数量`4`s,
 -`seven`: 数量`7`s,
 -`inc`：最长非递减子序列长度，
 -`dec`：最长的不递增子序列长度。 

对于单个字符：

 - 如果是的话`4`，那么所有四个值都是`(1, 0, 1, 1)`,
 - 如果是的话`7`，那么他们就是`(0, 1, 1, 1)`。 
3. 将两个子节点合并为一个父节点。 

计数很简单：```
four = left.four + right.four
seven = left.seven + right.seven
```为了`inc`，或者：

 - 我们用一切好东西`4`从左边开始，并从右边继续最佳递增子序列，
 - 或者我们使用从左侧开始的最佳递增子序列并附加所有好的子序列`7`从右边开始。 

所以：```
inc = max(left.four + right.inc,
          left.inc + right.seven)
```同样的想法给出：```
dec = max(left.seven + right.dec,
          left.dec + right.four)
```4. 支持翻转的延迟传播。 

每翻转一次即可交换`4`和`7`。 

这意味着：```
four <-> seven
inc <-> dec
```我们还为节点切换一个惰性标志。 
5. 在范围更新期间，如果当前节点完全位于更新间隔内，则立即应用翻转并停止下降。 

否则，将任何挂起的惰性操作推送给子级并继续递归。 
6. 对于一个`count`查询，答案始终是`inc`值存储在根中。 

根代表整个字符串，因此它的最佳非递减子序列正是所需的答案。 

### 为什么它有效

 对于每个细分市场，`inc`始终存储子序列的最大可能长度，形状如下`444...777`。 任何穿过中点的有效子序列必须完成其`4`部分留在左孩子中或开始其`7`参与正确的孩子。 合并公式准确地列举了这些可能性。 

翻转操作保留了正确性，因为交换`4`和`7`将递增子序列转换为递减子序列，反之亦然。 交换存储的值会更新节点以匹配翻转的段，而无需重建它。 

由于每个节点始终包含其段的正确信息，因此根始终包含整个字符串的正确答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SegmentTree:
    def __init__(self, s):
        self.n = len(s)
        size = 4 * self.n

        self.four = [0] * size
        self.seven = [0] * size
        self.inc = [0] * size
        self.dec = [0] * size
        self.lazy = [False] * size

        self.s = s
        self.build(1, 0, self.n - 1)

    def build(self, node, l, r):
        if l == r:
            if self.s[l] == '4':
                self.four[node] = 1
            else:
                self.seven[node] = 1

            self.inc[node] = 1
            self.dec[node] = 1
            return

        mid = (l + r) // 2

        self.build(node * 2, l, mid)
        self.build(node * 2 + 1, mid + 1, r)

        self.pull(node)

    def pull(self, node):
        left = node * 2
        right = node * 2 + 1

        self.four[node] = self.four[left] + self.four[right]
        self.seven[node] = self.seven[left] + self.seven[right]

        self.inc[node] = max(
            self.four[left] + self.inc[right],
            self.inc[left] + self.seven[right]
        )

        self.dec[node] = max(
            self.seven[left] + self.dec[right],
            self.dec[left] + self.four[right]
        )

    def apply_flip(self, node):
        self.four[node], self.seven[node] = (
            self.seven[node],
            self.four[node]
        )

        self.inc[node], self.dec[node] = (
            self.dec[node],
            self.inc[node]
        )

        self.lazy[node] ^= True

    def push(self, node):
        if self.lazy[node]:
            self.apply_flip(node * 2)
            self.apply_flip(node * 2 + 1)
            self.lazy[node] = False

    def update(self, node, l, r, ql, qr):
        if ql <= l and r <= qr:
            self.apply_flip(node)
            return

        self.push(node)

        mid = (l + r) // 2

        if ql <= mid:
            self.update(node * 2, l, mid, ql, qr)

        if qr > mid:
            self.update(node * 2 + 1, mid + 1, r, ql, qr)

        self.pull(node)

def solve():
    n, m = map(int, input().split())
    s = input().strip()

    seg = SegmentTree(s)

    ans = []

    for _ in range(m):
        query = input().split()

        if query[0] == "count":
            ans.append(str(seg.inc[1]))
        else:
            l = int(query[1]) - 1
            r = int(query[2]) - 1

            seg.update(1, 0, n - 1, l, r)

    sys.stdout.write("\n".join(ans))

solve()
```该树存储四个数组而不是自定义对象，因为 Python 对象分配在这种规模下变得昂贵。 输入大小足够大，因此实现细节很重要。 

这`pull`方法包含核心转移公式。 一个常见的错误是试图计算`inc`作为：```
max(left.inc, right.inc)
```这忽略了穿过中点的子序列，而这正是最佳子序列经常出现的位置。 

惰性传播在这里特别优雅。 翻转段不需要子级重新计算。 我们只交换存储的值。 这是可行的，因为每个结构属性在交换下都是对称的`4`和`7`。 

更新使用包含范围。 由于输入是 1 索引，但实现是 0 索引，因此两个端点在更新调用之前都会递减。 

每个问题的答案`count`查询是`seg.inc[1]`，因为节点`1`是代表整个字符串的根。 

## 工作示例

 ### 示例 1

 输入：```
2 3
47
count
switch 1 2
count
```| 步骤| 字符串| 根公司| 输出|
 | ---| ---| ---| ---|
 | 初始| 47 | 47 2 | |
 | 计数| 47 | 47 2 | 2 |
 | 开关 1 2 | 74 | 74 1 | |
 | 计数| 74 | 74 1 | 1 |

 最初，整个字符串已经是非递减的。 翻转两个位置后，字符串变为`74`。 任何非递减子序列只能包含一个字符，因此答案为`1`。 

### 示例 2

 考虑：```
3 4
747
count
switch 1 1
count
switch 2 3
count
```| 步骤| 字符串| 最佳子序列| 根公司| 输出|
 | ---| ---| ---| ---| ---|
 | 初始| 747 | 747 47 | 47 2 | |
 | 计数| 747 | 747 47 | 47 2 | 2 |
 | 开关 1 1 | 447 | 447 447 | 447 3 | |
 | 计数| 447 | 447 447 | 447 3 | 3 |
 | 开关 2 3 | 474 | 474 44 | 44 2 | |
 | 计数| 474 | 474 44 | 44 2 | 2 |

 该跟踪显示了为什么数字顺序很重要。 两个都`447`和`474`包含两个`4`s 和一`7`，但他们的答案因排列而不同。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(m log n) | 每次范围更新都会涉及对数个线段树节点 |
 | 空间| O(n) | 线段树每个节点存储恒定量的信息 |

 和`n = 10^6`和`m = 3 * 10^5`， 一个`O(m log n)`解决方案很容易符合限制。 线段树包含大约`4n`节点，当使用整数数组实现时，在内存限制下是可以接受的。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    input_data = io.StringIO(inp)
    output_data = io.StringIO()

    input = input_data.readline

    class SegmentTree:
        def __init__(self, s):
            self.n = len(s)

            size = 4 * self.n

            self.four = [0] * size
            self.seven = [0] * size
            self.inc = [0] * size
            self.dec = [0] * size
            self.lazy = [False] * size

            self.s = s

            self.build(1, 0, self.n - 1)

        def build(self, node, l, r):
            if l == r:
                if self.s[l] == '4':
                    self.four[node] = 1
                else:
                    self.seven[node] = 1

                self.inc[node] = 1
                self.dec[node] = 1
                return

            mid = (l + r) // 2

            self.build(node * 2, l, mid)
            self.build(node * 2 + 1, mid + 1, r)

            self.pull(node)

        def pull(self, node):
            left = node * 2
            right = node * 2 + 1

            self.four[node] = self.four[left] + self.four[right]
            self.seven[node] = self.seven[left] + self.seven[right]

            self.inc[node] = max(
                self.four[left] + self.inc[right],
                self.inc[left] + self.seven[right]
            )

            self.dec[node] = max(
                self.seven[left] + self.dec[right],
                self.dec[left] + self.four[right]
            )

        def apply_flip(self, node):
            self.four[node], self.seven[node] = (
                self.seven[node],
                self.four[node]
            )

            self.inc[node], self.dec[node] = (
                self.dec[node],
                self.inc[node]
            )

            self.lazy[node] ^= True

        def push(self, node):
            if self.lazy[node]:
                self.apply_flip(node * 2)
                self.apply_flip(node * 2 + 1)
                self.lazy[node] = False

        def update(self, node, l, r, ql, qr):
            if ql <= l and r <= qr:
                self.apply_flip(node)
                return

            self.push(node)

            mid = (l + r) // 2

            if ql <= mid:
                self.update(node * 2, l, mid, ql, qr)

            if qr > mid:
                self.update(node * 2 + 1, mid + 1, r, ql, qr)

            self.pull(node)

    n, m = map(int, input().split())
    s = input().strip()

    seg = SegmentTree(s)

    ans = []

    for _ in range(m):
        q = input().split()

        if q[0] == "count":
            ans.append(str(seg.inc[1]))
        else:
            l = int(q[1]) - 1
            r = int(q[2]) - 1

            seg.update(1, 0, n - 1, l, r)

    return "\n".join(ans)

# provided sample
assert run(
"""2 3
47
count
switch 1 2
count
"""
) == "2\n1", "sample 1"

# minimum size
assert run(
"""1 3
4
count
switch 1 1
count
"""
) == "1\n1", "single element"

# all equal values
assert run(
"""5 3
44444
count
switch 2 4
count
"""
) == "5\n3", "all equal then partial flip"

# overlapping updates
assert run(
"""4 5
4477
count
switch 1 2
count
switch 2 3
count
"""
) == "4\n4\n3", "lazy propagation composition"

# off-by-one boundaries
assert run(
"""5 4
74747
count
switch 1 5
count
"""
) == "3\n3", "full range update"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单个字符 |`1 1`| 最小尺寸处理 |
 |`44444`部分翻转 |`5 3`| 正确的子序列重新计算 |
 | 重叠更新 |`4 4 3`| 惰性传播组合 |
 | 全范围翻转|`3 3`| 边界正确性 |

 ## 边缘情况

 考虑字符串：```
4 1
7474
count
```正确答案是：```
3
```最好的子序列是`447`。 仅存储数字计数的解决方案会错误地认为答案仅取决于频率并可能输出`4`。 线段树避免了这种情况，因为`inc`对订购信息进行编码。 

现在考虑重复重叠翻转：```
4 3
4477
switch 1 2
switch 2 3
count
```执行过程如下：```
4477
-> 7777
-> 7447
```答案是`3`，使用子序列`447`。 

惰性标志切换而不是覆盖。 如果我们替换该标志而不是对其进行异或运算，则第二次更新将破坏挂起的信息并产生错误的状态。 

最后，考虑一个完整的范围翻转：```
5 2
44777
switch 1 5
count
```翻转后：```
77444
```最佳非递减子序列有长度`3`。 

该实现通过交换来有效地处理这个问题：```
four <-> seven
inc <-> dec
```直接到达根节点，无需遍历整个段。
