---
title: "CF 98A - 帮助明智的维多利亚"
description: "我们有六颗宝石，每颗宝石都有六种可能的颜色之一。 六颗宝石必须放置在立方体的六个面上。 如果一个位置可以轮换到另一个位置，则两个位置被视为相同。 输入只是一个长度为六的字符串。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "implementation"]
categories: ["algorithms"]
codeforces_contest: 98
codeforces_index: "A"
codeforces_contest_name: "Codeforces Beta Round 78 (Div. 1 Only)"
rating: 1700
weight: 98
solve_time_s: 132
verified: true
draft: false
---

[CF 98A - 帮助智者维多利亚](https://codeforces.com/problemset/problem/98/A)

 **评分：** 1700
 **标签：** 暴力破解、实施
 **求解时间：** 2m 12s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有六颗宝石，每颗宝石都有六种可能的颜色之一。 六颗宝石必须放置在立方体的六个面上。 如果一个位置可以轮换到另一个位置，则两个位置被视为相同。 

输入只是一个长度为六的字符串。 每个字符代表一颗宝石的颜色。 相同的字符意味着无法区分的宝石。 例如，输入`RGBRGB`意味着有两颗红色宝石、两颗绿色宝石和两颗蓝色宝石。 

我们必须计算可以形成多少种颜色根本不同的立方体。 立方体的旋转不会产生新的答案。 

输入的大小很小。 立方体上只有六个位置，因此即使是强力排列方法也是可行的。 最大数量的原始排列是`6! = 720`，这是非常小的。 真正的挑战是正确处理旋转等效性。 

这个问题的危险部分是立方体旋转很容易被低估。 一个简单的实现可能会单独计算两个旋转的立方体，即使它们代表相同的装饰。 

考虑输入：```
RGBYOV
```所有颜色都是不同的。 一个粗心的解决方案可能会回答`720`，因为有`6!`排列。 那是错误的。 每个物理立方体都有 24 个旋转对称性，因此许多排列会分解为相同的等价类。 正确答案是`720 / 24 = 30`。 

当存在重复颜色时，会出现另一个容易出现的错误。 

例如：```
RRGGGG
```如果我们只是机械地除以 24，我们就会得到无意义的结果，因为重复的颜色会产生重叠的配置。 我们必须比较旋转下的实际立方体状态，而不是依赖组合公式。 

一种更微妙的情况是所有颜色都相同：```
YYYYYY
```只有一种有效的装饰。 每次排列和每次旋转都会产生相同的立方体。 没有重复数据删除的基于排列的解决方案会严重超出计算范围。 

## 方法

 最直接的想法就是暴力。 我们生成六个宝石的每个排列，将每个排列解释为立方体面的颜色，然后将立方体旋转下等效的所有排列组合在一起。 

这是可行的，因为总搜索空间很小。 即使所有颜色都不同，也只有 720 种排列。 对于每个排列，我们可以测试所有 24 个立方体旋转。 总工作量保持在几万次操作以下。 

真正的问题是如何干净地表示旋转。 

立方体恰好有 24 个不同的方向。 如果我们将面从 0 编号到 5，则每次旋转都会成为这些索引的排列。 一旦我们预先计算了这 24 种排列，如果可以使用这些排列中的任何一种将一种颜色转换为另一种颜色，则两种颜色是等效的。 

强力版本可以使用所有 24 次旋转将每个排列与之前看到的每个排列进行比较。 这仍然可以通过，因为输入太小，但我们可以让它更干净。 

关键的观察是每个等价类都有一个规范代表。 对于任何颜色，我们都会生成所有 24 个旋转版本，并选择字典顺序最小的一个。 同一旋转类中的每个立方体都映射到相同的规范形式。 

这将问题转化为简单的集合重复数据删除。 

蛮力之所以有效，是因为状态空间很小，但在反复检查成对等价性时，它会变得很尴尬。 规范形式的观察将整个任务简化为：

 1. 生成所有不同的排列。 
2. 标准化每个排列。 
3. 计算唯一的标准化状态。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力配对比较 | O(720² × 24) | O(720) | 已接受 |
 | 规范表示 | O(720 × 24) | O(720) | 已接受 |

 ## 算法演练

 1. 将六个立方体面从 0 到 5 编号。 

我们只需要一致性。 一种常见的约定是：

 - 0 = 顶部
 - 1 = 底部
 - 2 = 前面
 - 3 = 后退
 - 4 = 左
 - 5 = 右
 2. 预先计算所有 24 个立方体旋转。 

每次旋转都表示为六个面索引的排列。 例如，旋转一圈可能会将顶面移动到前面，将前面移动到底部，等等。 

整个解决方案的正确性取决于准确生成 24 个物理立方体方向，不多也不少。 
3. 生成输入颜色的每种不同排列。 

由于相同的颜色无法区分，因此我们使用一组来自动删除重复的排列。 
4. 对于每个排列，生成所有 24 个旋转版本。 

应用旋转意味着根据旋转排列重新排列六种面部颜色。 
5. 选择字典顺序最小的旋转版本。 

这成为立方体着色的规范形式。 

每个旋转等效着色都会产生相同的规范形式，因为它们都生成相同的 24 个旋转状态集。 
6. 将规范形式插入集合中。 

集合自动删除重复项。 
7. 打印该套装的尺寸。 

该数量等于不同立方体装饰的数量。 

### 为什么它有效

 当一个立方体颜色可以旋转到另一个时，两个立方体颜色完全属于同一答案类别。 我们的标准化过程明确枚举了立方体着色的所有可能的旋转，并选择一个唯一的代表，即字典顺序最小的旋转状态。 

如果两种着色旋转等效，则它们的旋转状态组相同，因此它们获得相同的规范形式。 

如果两种颜色在旋转上不等价，则它们的旋转集永远不会相交，因此它们的规范形式不同。 

因此，规范形式集每个等价类包含一个元素，这正是所需的答案。 

## Python 解决方案```python
import sys
from itertools import permutations
from collections import deque

input = sys.stdin.readline

def compose(a, b):
    return tuple(a[b[i]] for i in range(6))

def solve():
    s = input().strip()

    # Face order:
    # 0 = top
    # 1 = bottom
    # 2 = front
    # 3 = back
    # 4 = left
    # 5 = right

    # Basic cube rotations
    rot_x = (2, 3, 1, 0, 4, 5)
    rot_y = (0, 1, 4, 5, 3, 2)
    rot_z = (4, 5, 2, 3, 1, 0)

    rotations = set()
    q = deque()

    identity = (0, 1, 2, 3, 4, 5)
    rotations.add(identity)
    q.append(identity)

    # Generate all 24 cube rotations
    while q:
        cur = q.popleft()

        for rot in (rot_x, rot_y, rot_z):
            nxt = compose(rot, cur)

            if nxt not in rotations:
                rotations.add(nxt)
                q.append(nxt)

    rotations = list(rotations)

    canonicals = set()

    for p in set(permutations(s)):
        best = None

        for rot in rotations:
            transformed = tuple(p[rot[i]] for i in range(6))

            if best is None or transformed < best:
                best = transformed

        canonicals.add(best)

    print(len(canonicals))

if __name__ == "__main__":
    solve()
```第一个重要部分是立方体旋转生成。 该解决方案不是手动对所有 24 个方向进行硬编码，而是从同一方向开始，并围绕坐标轴重复应用三个基本旋转。 广度优先扩展最终会发现所有 24 个独特的立方体方向。 

这`compose`函数组合了两个排列。 这是让我们从简单的旋转构建复杂的旋转的核心操作。 

排列生成步骤使用：```
set(permutations(s))
```这是至关重要的。 如果输入包含重复的颜色，普通`permutations`会产生许多重复项。 

规范化步骤是算法的核心。 对于每种排列，我们应用所有 24 次旋转并按字典顺序保留最小元组。 使用元组而不是字符串可以使比较简单且高效。 

一个常见的实现错误是意外反转排列方向。 表达式：```
tuple(p[rot[i]] for i in range(6))
```意思是“现在出现在脸上的颜色`i`来自脸`rot[i]`”。一致性比确切的约定更重要。

 ## 工作示例

 ### 示例 1

 输入：```
YYYYYY
```所有排列都是相同的。 

| 排列| 规范形式|
 | --- | --- |
 | YYYYYY | YYYYYY |

 最终设定尺寸：```
1
```这个例子表明，重复的颜色将许多排列折叠成一个配置。 每次旋转也保持相同。 

### 示例 2

 输入：```
RGBYOV
```所有颜色都是不同的。 

假设一种排列是：

 | 原创面孔 | 状态|
 | --- | --- |
 | 0 1 2 3 4 5 | 0 1 2 3 4 5 RGBYOV |

 一些旋转会产生：

 | 旋转| 结果 |
 | --- | --- |
 | 身份| RGBYOV |
 | 旋转 X | BYGRVO |
 | 旋转 Y | RGOVYB |
 | 旋转 Z | OVRGBY |

 在所有 24 个旋转状态中，字典顺序最小的一个成为规范形式。 

处理完所有 720 种排列后，剩下 30 种不同的规范形式。 

| 数量 | 价值|
 | --- | --- |
 | 原始排列 | 720 | 720
 | 立方体旋转 | 24 |
 | 独特的色彩 | 30|

 此示例演示了旋转折叠。 许多看似不同的面分配实际上代表同一个物理立方体。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(720 × 24) | 最多 720 个不同的排列，每个排列都在 24 次旋转下进行检查 |
 | 空间| O(720) | 规范状态的存储 |

 总的工作量很小。 即使在最坏的情况下有六种不同的颜色，程序也只执行几千次操作。 这很容易满足 1 秒的限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from itertools import permutations
from collections import deque

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    def compose(a, b):
        return tuple(a[b[i]] for i in range(6))

    s = input().strip()

    rot_x = (2, 3, 1, 0, 4, 5)
    rot_y = (0, 1, 4, 5, 3, 2)
    rot_z = (4, 5, 2, 3, 1, 0)

    rotations = set()
    q = deque()

    identity = (0, 1, 2, 3, 4, 5)

    rotations.add(identity)
    q.append(identity)

    while q:
        cur = q.popleft()

        for rot in (rot_x, rot_y, rot_z):
            nxt = compose(rot, cur)

            if nxt not in rotations:
                rotations.add(nxt)
                q.append(nxt)

    canonicals = set()

    for p in set(permutations(s)):
        best = None

        for rot in rotations:
            transformed = tuple(p[rot[i]] for i in range(6))

            if best is None or transformed < best:
                best = transformed

        canonicals.add(best)

    return str(len(canonicals)) + "\n"

# provided sample
assert run("YYYYYY\n") == "1\n", "sample 1"

# all distinct colors
assert run("ROYGBV\n") == "30\n", "all distinct"

# two groups of three
assert run("RRRGGG\n") == "2\n", "three and three"

# one unique gem
assert run("RBBBBB\n") == "1\n", "single special face"

# symmetric pair structure
assert run("RRGGBB\n") == "6\n", "pair symmetry"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`YYYYYY`|`1`| 完全相同的配置|
 |`ROYGBV`|`30`| 不同状态的最大数量 |
 |`RRRGGG`|`2`| 非平凡旋转等价 |
 |`RBBBBB`|`1`| 单一独特的面孔始终可以在任何地方旋转 |
 |`RRGGBB`|`6`| 具有部分对称性的多种重复颜色 |

 ## 边缘情况

 考虑完全对称的情况：```
YYYYYY
```只有一种不同的排列。 每次旋转也会产生相同的排列：```
YYYYYY
```规范集恰好接收一个元素，因此算法输出`1`。 

现在考虑：```
RBBBBB
```乍一看，似乎有六种可能，因为红色宝石可以占据任何一张脸。 轮换破坏了这种区别。 任何面都可以旋转到立方体上的任何其他面。 

在规范化过程中，所有六个原始排列映射到相同的规范化状态。 算法正确输出`1`。 

最后，考虑：```
RRRGGG
```简单的组合方法可能会假设所有排列都是等效的，但这是错误的。 实际上有两种根本不同的结构：

 1. 三张红脸在角落相遇。 
2. 三张红脸循环围绕一张脸。 

规范化过程会自动区分这些结构，因为立方体旋转无法将一种结构转换为另一种结构。 最终答案变成`2`。
