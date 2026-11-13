---
title: "CF 254A - 带数字的卡片"
description: "我们有 2n 张卡片按顺序排列。 每张卡片上都写有一个整数，每张卡片上还有一个从 1 到 2n 的索引。 任务是将所有卡片精确地分成 n 对，使得每对中的两张卡片包含相同的数字。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "sortings"]
categories: ["algorithms"]
codeforces_contest: 254
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 155 (Div. 2)"
rating: 1200
weight: 254
solve_time_s: 150
verified: false
draft: false
---

[CF 254A - 带数字的卡片](https://codeforces.com/problemset/problem/254/A)

 **评分：** 1200
 **标签：** 构造性算法，排序
 **求解时间：** 2m 30s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有`2n`卡片按顺序排列。 每张卡片上都写有一个整数，并且每张卡片上还有一个索引`1`到`2n`。 任务是将所有卡片准确地分成`n`使每对内的两张牌都包含相同的数字。 

输出不要求提供值本身。 它询问形成有效对的卡片的索引。 如果即使一个值出现奇数次，则不可能形成完整的对，我们必须打印`-1`。 

约束立即告诉我们解决方案必须接近线性时间。 最多有`6 * 10^5`总共有多少张牌，所以任何二次方都会爆炸。 重复扫描剩余卡片的简单配对搜索方法的执行顺序为`(2n)^2`最坏情况下的比较，对于一秒的限制来说太大了。 另一方面，按频率对值进行散列或分组很容易，因为每张卡只需要处理恒定的次数。 

有一些边缘情况可能会悄悄地破坏粗心的实现。 

考虑这个输入：```
2
1 2 1 2
```正确答案是：```
1 3
2 4
```有缺陷的实现可能会在配对一次后意外地重用索引，特别是如果它只跟踪值而不跟踪消耗的特定事件。 

另一个重要的情况是当一个值出现奇数次时：```
2
5 5 5 7
```价值`5`出现三次，因此一份副本将始终保持不匹配状态。 正确的输出是：```
-1
```粗心的贪婪解决方案可能会将两个配对`5`s 并忘记验证所有出现的事件都已被消耗。 

还有一种情况是所有卡都包含相同的数字：```
3
9 9 9 9 9 9
```每个索引仍必须在输出中恰好出现一次。 有效配对是任意的，但实现必须避免跳过或重复位置。 

## 方法

 蛮力的想法很简单。 对于每张未配对的卡，扫描剩余的卡，直到找到另一张具有相同值的卡。 找到后，将两者标记为已使用并继续。 

这是有效的，因为任何有效的解决方案只需要将相等的值分组在一起。 问题是效率。 在最坏的情况下，每次搜索都可能扫描几乎整个剩余数组。 高达`6 * 10^5`卡片的比较次数大致可以达到`3.6 * 10^11`，这是完全不可行的。 

关键的观察是，只有在按价值对牌进行分组后，实际位置才重要。 如果我们知道特定数字出现的所有索引，那么形成对就变得微不足道了。 我们只需一次获取两个索引即可。 

这将问题从重复搜索转变为分组问题。 我们遍历数组一次，将每个索引存储在与其值对应的桶中，然后验证每个桶的大小是否均匀。 如果任何桶的大小是奇数，则不可能配对。 否则，桶内的连续索引会自动形成有效对。 

值最多为`5000`，所以即使是向量数组也可以工作，但哈希映射同样干净和通用。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(n) | 太慢了 |
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 阅读`n`和数组`2n`卡值。 
2. 创建一个字典，其中每个键都是一个卡值，关联的列表存储该值出现的所有索引。 
3. 从左到右遍历数组。 
4. 对于每个位置`i`, 附加索引`i + 1`进入value对应的列表`a[i]`。 

我们储存`i + 1`因为该问题使用从 1 开始的索引。 
5. 对所有索引进行分组后，迭代每个值组。 
6. 如果任意组的大小为奇数，则打印`-1`并立即终止。 

奇数计数意味着一张牌永远不能与另一张相同的牌匹配。 
7. 否则，一次处理两个组的索引。 
8. 打印`(indices[0], indices[1])`， 然后`(indices[2], indices[3])`， 等等。 

由于组内的所有索引都属于相同的值，因此每个生成的对都是有效的。 

### 为什么它有效

 该算法维护一个简单的不变量：每个存储的列表恰好包含具有相同值的卡片的索引。 

如果某个值出现奇数次，则在每种可能的排列中至少有一张牌保持不匹配，因此不存在有效的解决方案。 

如果某个值出现偶数次，则在该组内配对连续索引始终有效，因为每对都包含相同的值，并且不会重用任何索引。 由于组对数组的所有索引进行了划分，因此每张卡片都恰好出现在一对打印中。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

from collections import defaultdict

def solve():
    n = int(input())
    a = list(map(int, input().split()))

    pos = defaultdict(list)

    for i, x in enumerate(a, start=1):
        pos[x].append(i)

    ans = []

    for indices in pos.values():
        if len(indices) % 2 == 1:
            print(-1)
            return

        for i in range(0, len(indices), 2):
            ans.append((indices[i], indices[i + 1]))

    print("\n".join(f"{x} {y}" for x, y in ans))

solve()
```字典`pos`是解决方案的核心结构。 每个值都映射到它出现的所有索引。 因为我们在从左到右扫描时附加索引，所以每次出现都会被记录一次。 

这`enumerate(..., start=1)`调用很重要，因为问题期望索引从`1`。 忘记这一点是最常见的错误之一。 

奇偶校验在创建对之前进行。 一旦组的大小为奇数，就没有理由继续处理，因为整个实例是不可能的。 

配对循环前进`2`每次迭代。 这保证了每个索引仅使用一次并防止对之间的意外重叠。 

该解决方案不依赖于排序。 索引的原始顺序已经提供了足够的结构。 

## 工作示例

 ### 示例 1

 输入：```
3
20 30 10 30 20 10
```分组后：

 | 价值| 指数|
 | --- | --- |
 | 20 | [1, 5] |
 | 30| [2, 4] |
 | 10 | 10 [3, 6] |

 配对构造：

 | 当前组 | 生产对 |
 | --- | --- |
 | [1, 5] | (1, 5) |
 | [2, 4] | (2, 4) |
 | [3, 6] | (3, 6) |

 可能的输出：```
1 5
2 4
3 6
```该轨迹展示了算法的中心不变量。 每组都只包含一个值的索引，因此任何连续的配对都自动有效。 

### 示例 2

 输入：```
2
5 5 5 7
```分组后：

 | 价值| 指数|
 | --- | --- |
 | 5 | [1,2,3]|
 | 7 | [4] |

 奇偶校验：

 | 价值| 计数 | 甚至？ |
 | --- | --- | --- |
 | 5 | 3 | 没有 |
 | 7 | 1 | 没有 |

 输出：```
-1
```这个例子说明了为什么奇偶校验条件是必要且充分的。 一旦某个值具有奇数频率，则一次出现必须保持不匹配。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个卡索引插入一次并在配对过程中再次处理 |
 | 空间| O(n) | 字典存储了所有`2n`指数|

 约束允许最多`6 * 10^5`卡总数，因此线性复杂度很容易足够快。 内存使用也是安全的，因为我们只存储索引本身。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from collections import defaultdict

def solve():
    input = sys.stdin.readline

    n = int(input())
    a = list(map(int, input().split()))

    pos = defaultdict(list)

    for i, x in enumerate(a, start=1):
        pos[x].append(i)

    ans = []

    for indices in pos.values():
        if len(indices) % 2 == 1:
            print(-1)
            return

        for i in range(0, len(indices), 2):
            ans.append((indices[i], indices[i + 1]))

    print("\n".join(f"{x} {y}" for x, y in ans))

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    out = sys.stdout.getvalue().strip()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return out

# provided sample
out = run("3\n20 30 10 30 20 10\n")
pairs = set(tuple(map(int, line.split())) for line in out.splitlines())

assert len(pairs) == 3

# minimum size valid
assert run("1\n7 7\n") == "1 2"

# impossible because of odd frequency
assert run("2\n5 5 5 7\n") == "-1"

# all equal values
out = run("3\n9 9 9 9 9 9\n")
pairs = [tuple(map(int, line.split())) for line in out.splitlines()]
used = set()

for x, y in pairs:
    used.add(x)
    used.add(y)

assert len(pairs) == 3
assert used == {1, 2, 3, 4, 5, 6}

# alternating values
out = run("2\n1 2 1 2\n")
pairs = [tuple(map(int, line.split())) for line in out.splitlines()]
used = set()

for x, y in pairs:
    used.add(x)
    used.add(y)

assert len(pairs) == 2
assert used == {1, 2, 3, 4}
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 7 7`|`1 2`| 最小有效输入|
 |`2 / 5 5 5 7`|`-1`| 奇数频率检测|
 |`3 / 9 9 9 9 9 9`| 任何完整配对 | 重复相同的值 |
 |`2 / 1 2 1 2`| 任何有效的配对 | 非相邻匹配索引|

 ## 边缘情况

 考虑输入：```
2
1 2 1 2
```这些团体变成：```
1 -> [1, 3]
2 -> [2, 4]
```该算法将每组内的连续索引配对，产生：```
1 3
2 4
```即使原始数组中相等的值被分隔开，按值分组也完全消除了位置复杂性。 

现在考虑：```
2
5 5 5 7
```存储的组是：```
5 -> [1, 2, 3]
7 -> [4]
```在验证过程中，算法检测到两个组的大小均为奇数。 那一刻它立即打印`-1`。 不会尝试部分配对，因此算法永远不会产生无效的不完整答案。 

最后，考虑全平等的情况：```
3
9 9 9 9 9 9
```单个组变为：```
9 -> [1, 2, 3, 4, 5, 6]
```配对循环以两步处理索引：```
(1, 2)
(3, 4)
(5, 6)
```每个索引都只使用一次，这证实了该算法可以正确处理大型重复组。
