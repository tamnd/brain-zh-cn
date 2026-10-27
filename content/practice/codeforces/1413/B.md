---
title: "CF 1413B - 新技术"
description: "我们给出了未知矩阵的所有行和同一矩阵的所有列。 问题是两个集合都被打乱了。 行以任意顺序呈现，列也以任意顺序呈现。 在行内，保留从左到右的顺序。"
date: "2026-06-11T07:21:04+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1413
codeforces_index: "B"
codeforces_contest_name: "Technocup 2021 - Elimination Round 1"
rating: 1100
weight: 1413
solve_time_s: 143
verified: true
draft: false
---

[CF 1413B - 新技术](https://codeforces.com/problemset/problem/1413/B)

 **评分：** 1100
 **标签：** 实施
 **求解时间：** 2m 23s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给出了未知矩阵的所有行和同一矩阵的所有列。 

问题是两个集合都被打乱了。 行以任意顺序呈现，列也以任意顺序呈现。 在行内，保留从左到右的顺序。 在列内，保留从上到下的顺序。 

每个值来自`1`到`n * m`在矩阵中只出现一次。 由于所有值都是不同的，因此每个数字都唯一标识一个单元格。 

任务是重建原始矩阵。 

约束是主要线索。 虽然`n`和`m`每个都能达到`500`，所有测试用例的矩阵单元总数最多为`250000`。 这意味着与细胞数量成比例的解决方案很容易足够快。 重复比较每一行和每一列并扫描这些比较中的整个数组的解决方案将接近`O(n * m * min(n,m))`，这是不必要的，并且有接近极限时变慢的风险。 

输入的结构隐藏了一个非常有用的属性：每个数字都是唯一的。 这意味着如果我们知道一个值在最终行排序中属于哪个位置，我们就立即知道包含该值的每一行的位置。 

一个常见的错误是尝试将行与所有列进行匹配并逐个单元地重建矩阵。 考虑：```
n = 2, m = 3

Rows:
6 5 4
1 2 3

Columns:
1 6
2 5
3 4
```如果我们任意选择第一行作为顶行，我们将得到：```
6 5 4
1 2 3
```该矩阵与列顺序不匹配。 正确的重构是：```
1 2 3
6 5 4
```行顺序必须根据列确定，而不是猜测。 

另一种微妙的情况发生在`m = 1`。```
Rows:
3
1
2

Column:
3 1 2
```只有一列，因此该列完全决定行顺序：```
3
1
2
```任何假设存在多列或始终使用第一行作为锚点的解决方案都可能在此处失败。 

## 方法

 暴力方法会尝试通过将每一行与每一列进行比较来确定正确的行顺序。 由于每个值都是唯一的，因此可以搜索行的第一个元素出现在列中的位置，并使用该信息来放置该行。 

这是可行的，但是天真地实现它会重复扫描行和列。 由于单元格总数高达 250,000 个，不必要的重复搜索会产生远远超出所需的工作量。 

关键的观察结果是每个值在整个矩阵中只出现一次。 

认为`n <= m`。 那么每一列都包含`n`价值观。 如果我们检查任何行，它的第一个元素必须恰好出现在其中一列内的一个位置。 该位置正是最终矩阵中该行的行索引。 

更好的是，Codeforces 的预期解决方案使用每个序列具有较少条目的维度。 

什么时候`n <= m`，我们首先读取行并构建映射：```
first element of row -> row contents
```然后我们检查列。 包含这些第一个元素之一的列显示了完整的行排序，因为它从上到下的顺序正是矩阵中行的顺序。 

什么时候`n > m`，同样的想法通过使用列来对称地发挥作用。 

对于这个特定问题，一个更简单的公式就足够了。 

每行都由其第一个元素唯一标识。 在给定的列中，只有一列包含这些第一个元素。 一旦我们找到该列，它的顺序立即给出答案中的行顺序。 

这将重构减少为几次哈希表查找。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n²m) | O(纳米) | 太慢了 |
 | 最佳 | O(纳米) | O(纳米) | 已接受 |

 ## 算法演练

 1. 阅读全部`n`行并存储它们。 
2. 创建一个字典，将每行的第一个元素映射到整行。 

这允许我们在知道行的第一个值时立即恢复该行。 
3. 阅读全部`m`列。 
4. 查找包含存储的行优先元素之一的列。 

由于每行的第一个元素在矩阵中只出现一次，因此只有一列的条目恰好是所有行的第一个元素。 
5. 使用该列中值的顺序来确定行顺序。 

如果该列包含：```
a
b
c
```然后以开头的行`a`,`b`， 和`c`必须按该顺序出现在最终矩阵中。 
6. 输出对应的行。 

### 为什么它有效

 每行都由其第一个元素唯一标识，因为所有矩阵值都是不同的。 

考虑包含顶行第一个元素的列。 由于列保留从上到下的顺序，因此同一列还包含按照正确的垂直顺序排列的每隔一行的第一个元素。 

一旦找到该列，第一个元素的序列就唯一地确定行的序列。 将每个第一个元素替换为其相应的行即可重建整个矩阵。 由于该问题保证了唯一有效的矩阵，因此不会存在任何歧义。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())

    out = []

    for _ in range(t):
        n, m = map(int, input().split())

        rows = [list(map(int, input().split())) for _ in range(n)]

        pos = {}
        for row in rows:
            pos[row[0]] = row

        answer_order = None

        for _ in range(m):
            col = list(map(int, input().split()))

            if answer_order is None:
                for x in col:
                    if x in pos:
                        answer_order = col
                        break

        for first_value in answer_order:
            out.append(" ".join(map(str, pos[first_value])))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```该解决方案将每一行存储在以其第一个元素为键的字典中。 

在读取列时，我们搜索包含行前导值的特殊列。 由于所有值都是唯一的，因此一旦列包含任何行前导值，该列就是由所有行前导值形成的列。 Its ordering is the desired row ordering.

 发现该列后，重建就变成了一系列字典查找。 

一个常见的实施错误是在找到匹配值后停止而不保留整个列。 需要整列，因为它提供所有行的排序，而不仅仅是一行。 

另一个容易犯的错误是假设匹配的列必须是读取的第一列。 这些列被打乱，因此必须检查每一列，直到找到正确的列。 

## 工作示例

 ### 示例 1

 输入：```
n = 2, m = 3

Rows:
6 5 4
1 2 3

Columns:
1 6
2 5
3 4
```词典构建：

 | 第一个元素 | 存储行 |
 | ---| ---|
 | 6 | [6,5,4]|
 | 1 | [1,2,3]|

 列扫描：

 | 专栏 | 包含行第一个元素？ | 行动|
 | ---| ---| ---|
 | [1,6]| 是的 | 选择此栏 |

 恢复订单：

 | 选定列中的值 | 输出行|
 | ---| ---|
 | 1 | [1,2,3]|
 | 6 | [6,5,4]|

 最终矩阵：```
1 2 3
6 5 4
```这个例子展示了中心思想。 专栏`[1,6]`直接告诉我们行的垂直顺序。 

### 示例 2

 输入：```
n = 3, m = 1

Rows:
3
1
2

Column:
3 1 2
```词典构建：

 | 第一个元素 | 存储行 |
 | ---| ---|
 | 3 | [3] |
 | 1 | [1] |
 | 2 | [2] |

 列扫描：

 | 专栏 | 包含行第一个元素？ | 行动|
 | ---| ---| ---|
 | [3,1,2]| 是的 | 选择 |

 恢复订单：

 | 价值| 输出行|
 | ---| ---|
 | 3 | [3] |
 | 1 | [1] |
 | 2 | [2] |

 最终矩阵：```
3
1
2
```This demonstrates that the method works even when there is only one column.

 ## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(纳米) | Every matrix value is read a constant number of times |
 | 空间| O(纳米) | 存储所有行和查找字典 |

 The total number of cells across all test cases is at most 250,000. A linear pass over those cells is comfortably within the time limit, and storing the matrix requires only a few megabytes of memory.

 ## 测试用例```python
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    t = int(input())
    out = []

    for _ in range(t):
        n, m = map(int, input().split())

        rows = [list(map(int, input().split())) for _ in range(n)]

        pos = {row[0]: row for row in rows}

        answer_order = None

        for _ in range(m):
            col = list(map(int, input().split()))

            if answer_order is None:
                for x in col:
                    if x in pos:
                        answer_order = col
                        break

        for x in answer_order:
            out.append(" ".join(map(str, pos[x])))

    return "\n".join(out)

# provided sample
assert run(
"""2
2 3
6 5 4
1 2 3
1 6
2 5
3 4
3 1
2
3
1
3 1 2
"""
) == (
"""1 2 3
6 5 4
3
1
2"""
)

# minimum size
assert run(
"""1
1 1
1
1
"""
) == "1"

# single column
assert run(
"""1
3 1
3
1
2
3 1 2
"""
) == (
"""3
1
2"""
)

# single row
assert run(
"""1
1 4
1 2 3 4
1
2
3
4
"""
) == "1 2 3 4"

# reordered rows and columns
assert run(
"""1
3 2
5 6
1 2
3 4
1 3 5
2 4 6
"""
) == (
"""1 2
3 4
5 6"""
)
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1×1 矩阵 | 相同的单值| 最小边界 |
 | 3×1 矩阵 | 保留列顺序 | 单列处理 |
 | 1×4 矩阵 | 原始行 | 单排搬运|
 | 打乱行| 重构矩阵| 正确的行排序恢复 |

 ## 边缘情况

 考虑单列情况：```
1
3 1
3
1
2
3 1 2
```字典变成：```
3 -> [3]
1 -> [1]
2 -> [2]
```唯一的列是`[3,1,2]`。 该列被选为排序列。 查找每个值会产生：```
[3]
[1]
[2]
```这正是正确的矩阵。 

考虑输入中的第一行不是顶行的情况：```
1
2 3
6 5 4
1 2 3
1 6
2 5
3 4
```粗心的解决方案可能会按输入顺序输出行：```
6 5 4
1 2 3
```该算法反而会找到该列`[1,6]`，将其解释为行首的垂直排序，并输出：```
1 2 3
6 5 4
```匹配所有列。 

考虑一个单行矩阵：```
1
1 4
1 2 3 4
1
2
3
4
```行字典仅包含一项。 每列都包含一个值。 第一个匹配列立即标识唯一的行，并且算法不变地输出唯一的有效矩阵。
