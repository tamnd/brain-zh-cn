---
title: "CF 61E - 敌人很弱"
description: "我们得到了一组不同的整数，代表排成一列的士兵的力量。 我们需要计算有多少个索引三元组 (i, j, k) 同时满足两个条件： - 位置排序为 i < j < k - 值严格递减为 a[i] a[j]…"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "trees"]
categories: ["algorithms"]
codeforces_contest: 61
codeforces_index: "E"
codeforces_contest_name: "Codeforces Beta Round 57 (Div. 2)"
rating: 1900
weight: 61
solve_time_s: 114
verified: true
draft: false
---

[CF 61E - 敌人很弱](https://codeforces.com/problemset/problem/61/E)

 **评级：** 1900
 **标签：** 数据结构，树
 **求解时间：** 1m 54s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一组不同的整数，代表排成一列的士兵的力量。 我们需要计算有多少个索引三元组`(i, j, k)`同时满足两个条件：

 - 位置排序为`i < j < k`- 这些值严格递减`a[i] > a[j] > a[k]`另一种思考方式是：对于每个中间位置`j`，我们想知道它之前有多少个较大的元素以及它之后有多少个较小的元素。 这些选择的每一种组合都形成一个有效的递减三元组。 

这些约束完全决定了我们需要什么样的算法。 数组大小可以达到`10^6`, which rules out anything quadratic, let alone cubic. 甚至一个`O(n^2)`解决方案需要大约`10^12`最坏情况下的操作，远远超出了5秒的时间。 目标复杂度必须接近线性或`O(n log n)`。 

值本身可以大到`10^9`，所以我们不能直接构建按值索引的数组。 任何依赖于值范围的数据结构首先需要进行坐标压缩。 

一个微妙的问题是整数溢出。 递减三元组的数量可能非常大。 例如，如果数组严格递减并且`n = 10^6`，答案是：$$\binom{10^6}{3}$$那是周围`1.67 × 10^17`，它不适合 32 位整数。 Python 会自动处理这个问题，但在 C++ 中，答案必须存储在`long long`。 

另一个容易犯的错误是对“严格更大”条件的处理不当。 假设数组是：```
4
5 5 4 3
```该问题保证了不同的值，因此此输入无效，但许多通用实现意外地使用了`>=`或者`<=`逻辑。 如果存在重复项，不正确的不平等处理会默默地过度计数。 正确的条件是每一步都严格递减。 

更现实的边缘情况是严格递增的数组：```
5
1 2 3 4 5
```正确答案是`0`因为不存在递减三元组。 一个粗心的实现混合了左右计数，可能会意外地计算出递增的模式。 

另一个重要的场景是所有有效的三元组共享相同的中间元素。 例如：```
5
5 4 3 2 1
```每个三元组在这里都是有效的，给出：$$\binom{5}{3} = 10$$这种情况强调算法是否正确地将“左边更大”和“右边更小”结合起来。 

## 方法

 暴力解法直接遵循定义。 我们尝试每一个三重`(i, j, k)`和`i < j < k`并检查这些值是否形成严格递减序列。```
for i:
    for j > i:
        for k > j:
            check a[i] > a[j] > a[k]
```这是正确的，因为每个可能的三元组都被检查一次。 问题是运行时间。 三元组的数量为：$$\binom{n}{3}$$为了`n = 10^6`，大致就是`1.67 × 10^17`迭代，这是完全不可能的。 

关键的观察结果是中间指数`j`决定一切。 如果我们已经知道：

 - 前面有多少个元素`j`大于`a[j]`- 之后有多少个元素`j`小于`a[j]`然后使用有效三元组的数量`j`因为中间元素很简单：$$\text{leftGreater}[j] \times \text{rightSmaller}[j]$$这将问题从搜索三元组转变为回答频率查询。 

现在任务变成：

 - 从左到右扫描时，计算有多少个先前值大于当前值。 
- 从右向左扫描时，计算有多少个后面的值小于当前值。 

这些是经典的前缀频率查询，可以使用 Fenwick 树有效处理。 

因为数组值最多可达`10^9`，我们首先将它们压缩成等级`1`到`n`。 由于所有值都是不同的，因此压缩可以准确地保留顺序。 

每个 Fenwick Tree 操作都需要`O(log n)`，并且我们对每个元素执行恒定数量的操作。 这给出了总的复杂性`O(n log n)`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |`O(n^3)`|`O(1)`| 太慢了|
 | 最佳 |`O(n log n)`|`O(n)`| 已接受 |

 ## 算法演练

 1. 读取数组并对其值进行坐标压缩。 

我们对不同的值进行排序并分配排名`1`到`n`。 芬威克树适用于紧凑的整数索引，因此压缩可以让我们保留比较，同时避免巨大的数组。 
2. 创建数组`left_greater`。`left_greater[i]`将存储有多少个较早的元素大于`a[i]`。 
3. 使用 Fenwick 树从左到右扫描数组。 

在每个位置：

 - 查询有多少个处理后的元素小于或等于当前值。 
- 从已处理元素的数量中减去该值以获得更大的数量。 
- 存储计数`left_greater[i]`。 
- 将当前值插入 Fenwick 树中。 

减法起作用的原因是每个先前的元素要么大于要么不大于，并且所有值都是不同的。 
4. 重置 Fenwick 树。 

我们现在将其重新用于后缀信息。 
5. 创建数组`right_smaller`。`right_smaller[i]`将存储有多少个后面的元素小于`a[i]`。 
6. 从右向左扫描阵列。 

在每个位置：

 - 查询有多少个已经看到的值严格小于当前值。 
- 将结果存储在`right_smaller[i]`。 
- 将当前值插入 Fenwick 树中。 

由于我们从右向左移动，因此树始终包含当前索引之后的元素。 
7. 计算最终答案。 

对于每个职位`i`， 添加：$$\text{left\_greater}[i] \times \text{right\_smaller}[i]$$每个有效的三元组都只有一个中间索引，因此对每个递减的三元组计数一次。 

### 为什么它有效

 对于任何固定的中间索引`j`，有效的三元组完全通过选择来确定：

 - 一个索引`i < j`和`a[i] > a[j]`- 一个索引`k > j`和`a[k] < a[j]`选择是独立的，因此三元组的数量集中在`j`是这两个计数的乘积。 

从左到右的 Fenwick 传递正确地跟踪了之前的所有元素`j`，并且从右到左的传递正确地跟踪了之后的所有元素`j`。 由于每个递减三元组都有一个唯一的中间位置，因此对所有的求和`j`对每个有效的三元组精确计数一次。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Fenwick:
    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 1)

    def update(self, idx, delta):
        while idx <= self.n:
            self.bit[idx] += delta
            idx += idx & -idx

    def query(self, idx):
        res = 0
        while idx > 0:
            res += self.bit[idx]
            idx -= idx & -idx
        return res

def solve():
    n = int(input())
    arr = list(map(int, input().split()))

    # coordinate compression
    vals = sorted(arr)
    rank = {v: i + 1 for i, v in enumerate(vals)}
    comp = [rank[x] for x in arr]

    left_greater = [0] * n
    right_smaller = [0] * n

    bit = Fenwick(n)

    # left greater counts
    for i in range(n):
        x = comp[i]

        less_or_equal = bit.query(x)
        left_greater[i] = i - less_or_equal

        bit.update(x, 1)

    bit = Fenwick(n)

    # right smaller counts
    for i in range(n - 1, -1, -1):
        x = comp[i]

        right_smaller[i] = bit.query(x - 1)

        bit.update(x, 1)

    ans = 0

    for i in range(n):
        ans += left_greater[i] * right_smaller[i]

    print(ans)

solve()
```Fenwick 树存储已处理的压缩值的频率计数。 这`update`操作插入一个值，并且`query(idx)`返回最多有多少个插入的值具有压缩排名`idx`。 

坐标压缩是必要的，因为值可以大到`10^9`。 芬威克树需要密集的整数索引，因此我们将值重新映射到范围中`1...n`同时保留顺序。 

在从左到右的遍历过程中，树恰好包含当前索引之前的元素。`bit.query(x)`告诉我们有多少个早期值小于或等于当前值。 由于所有值都是不同的，这相当于计算严格较小的值。 从中减去`i`，先前元素的数量，给出较大值的计数。 

从右到左的传递略有不同。 这里我们直接查询`x - 1`，它计算已插入树中的后缀中严格较小的元素。 

一个容易犯的差一错误是忘记 Fenwick 树通常是 1 索引的。 压缩开始于`1`， 不是`0`，特别是为了避免无限循环`update`。 

另一个微妙的细节是使用两个单独的通道，而不是尝试同时计算两个方向。 树的意义完全取决于遍历方向。 重复使用同一棵树而不重置它会错误地混合前缀和后缀信息。 

## 工作示例

 ### 示例 1

 输入：```
3
3 2 1
```压缩值仍然存在`[3, 2, 1]`。 

从左到右传递：

 | 我| 价值| 小于或等于 | 左大 |
 | ---| ---| ---| ---|
 | 0 | 3 | 0 | 0 |
 | 1 | 2 | 0 | 1 |
 | 2 | 1 | 0 | 2 |

 从右向左传递：

 | 我| 价值| 小右 | 右小 |
 | ---| ---| ---| ---|
 | 2 | 1 | 0 | 0 |
 | 1 | 2 | 1 | 1 |
 | 0 | 3 | 2 | 2 |

 最终计算：

 | 我| 左大 | 右小 | 贡献 |
 | ---| ---| ---| ---|
 | 0 | 0 | 2 | 0 |
 | 1 | 1 | 1 | 1 |
 | 2 | 2 | 0 | 0 |

 总答案 =`1`。 

这条痕迹清楚地表明了中心思想。 唯一索引`1`可以作为递减三元组的中间元素。 

### 示例 2

 输入：```
5
5 1 4 2 3
```压缩值是`[5, 1, 4, 2, 3]`。 

从左到右传递：

 | 我| 价值| 小于或等于 | 左大 |
 | ---| ---| ---| ---|
 | 0 | 5 | 0 | 0 |
 | 1 | 1 | 0 | 1 |
 | 2 | 4 | 1 | 1 |
 | 3 | 2 | 1 | 2 |
 | 4 | 3 | 2 | 2 |

 从右向左传递：

 | 我| 价值| 小右 | 右小 |
 | ---| ---| ---| ---|
 | 4 | 3 | 0 | 0 |
 | 3 | 2 | 0 | 0 |
 | 2 | 4 | 2 | 2 |
 | 1 | 1 | 0 | 0 |
 | 0 | 5 | 4 | 4 |

 最终计算：

 | 我| 左大 | 右小 | 贡献 |
 | ---| ---| ---| ---|
 | 0 | 0 | 4 | 0 |
 | 1 | 1 | 0 | 0 |
 | 2 | 1 | 2 | 2 |
 | 3 | 2 | 0 | 0 |
 | 4 | 2 | 0 | 0 |

 总答案 =`2`。 

有效的三元组是`(5,4,2)`和`(5,4,3)`。 这个例子说明了为什么中间索引观点很强大。 指数`2`恰好贡献了两个三元组，因为它前面有一个较大的元素，后面有两个较小的元素。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O(n log n)`| 每个 Fenwick 更新和查询都需要`O(log n)`，并且我们对每个元素执行一个常数 |
 | 空间|`O(n)`| 压缩数组、Fenwick Tree 和辅助数组均线性缩放 |

 和`n = 10^6`,`O(n log n)`当使用 Fenwick Trees 和快速 I/O 仔细实现时，Python 中的速度足够快。 内存使用量也完全符合 256 MB 的限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    class Fenwick:
        def __init__(self, n):
            self.n = n
            self.bit = [0] * (n + 1)

        def update(self, idx, delta):
            while idx <= self.n:
                self.bit[idx] += delta
                idx += idx & -idx

        def query(self, idx):
            res = 0
            while idx > 0:
                res += self.bit[idx]
                idx -= idx & -idx
            return res

    n = int(input())
    arr = list(map(int, input().split()))

    vals = sorted(arr)
    rank = {v: i + 1 for i, v in enumerate(vals)}
    comp = [rank[x] for x in arr]

    left_greater = [0] * n
    right_smaller = [0] * n

    bit = Fenwick(n)

    for i in range(n):
        x = comp[i]
        left_greater[i] = i - bit.query(x)
        bit.update(x, 1)

    bit = Fenwick(n)

    for i in range(n - 1, -1, -1):
        x = comp[i]
        right_smaller[i] = bit.query(x - 1)
        bit.update(x, 1)

    ans = 0

    for i in range(n):
        ans += left_greater[i] * right_smaller[i]

    return str(ans)

# provided sample
assert run("3\n3 2 1\n") == "1", "sample 1"

# minimum size, no valid triplet
assert run("3\n1 2 3\n") == "0", "strictly increasing"

# minimum size, exactly one triplet
assert run("3\n3 2 1\n") == "1", "strictly decreasing"

# larger decreasing case
assert run("5\n5 4 3 2 1\n") == "10", "all triples valid"

# mixed ordering
assert run("5\n5 1 4 2 3\n") == "2", "mixed arrangement"

# off-by-one style check
assert run("4\n4 1 3 2\n") == "1", "single valid triplet"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`3 / 1 2 3`|`0`| 不存在递减三元组 |
 |`3 / 3 2 1`|`1`| 最小的非平凡有效案例 |
 |`5 / 5 4 3 2 1`|`10`| 每个三元组都有效 |
 |`5 / 5 1 4 2 3`|`2`| 选择性贡献的混合订购|
 |`4 / 4 1 3 2`|`1`| 检测 Fenwick 查询中的差一错误 |

 ## 边缘情况

 考虑严格递增数组：```
5
1 2 3 4 5
```在从左到右的传递过程中，每个较早的值都较小，因此`left_greater`变成：```
[0, 0, 0, 0, 0]
```从右到左的传递仍然会找到较小的后缀值，但每个最终贡献都包含一个零因子：```
left_greater[i] * right_smaller[i] = 0
```最终答案是正确的`0`。 

现在考虑完全递减数组：```
5
5 4 3 2 1
```该算法计算：```
left_greater  = [0, 1, 2, 3, 4]
right_smaller = [4, 3, 2, 1, 0]
```贡献变为：```
0*4 + 1*3 + 2*2 + 3*1 + 4*0
= 0 + 3 + 4 + 3 + 0
= 10
```与预期值相符：$$\binom{5}{3} = 10$$这证实了乘法逻辑正确地计算了左侧较大元素和右侧较小元素的每个可能的配对。 

最后，检查只有一个中间索引起作用的情况：```
5
5 1 4 2 3
```在索引处`2`有价值`4`：

 - 在它之前存在一个更大的元素：`5`- 它后面存在两个较小的元素：`2`和`3`该算法将这些计数相乘：```
1 * 2 = 2
```没有其他索引有贡献。 这说明了为什么用中间元素分隔问题可以避免计数不足和重复计数。
