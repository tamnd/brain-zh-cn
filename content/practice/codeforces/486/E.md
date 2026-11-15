---
title: "CF 486E - 序列 LIS"
description: "给定一个数组，我们关心它的最长递增子序列。 如果该位置的值被选择作为该子序列的元素之一，则该索引属于最长递增子序列。 任务不是计算 LIS。"
date: "2026-06-07T17:29:17+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dp", "greedy", "hashing", "math"]
categories: ["algorithms"]
codeforces_contest: 486
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 277 (Div. 2)"
rating: 2200
weight: 486
solve_time_s: 143
verified: true
draft: false
---

[CF 486E - 序列 LIS](https://codeforces.com/problemset/problem/486/E)

 **评分：** 2200
 **标签：** 数据结构、dp、贪心、哈希、数学
 **求解时间：** 2m 23s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 给定一个数组，我们关心它的最长递增子序列。 如果该位置的值被选择作为该子序列的元素之一，则该索引属于最长递增子序列。 

任务不是计算 LIS。 相反，对于每个位置，我们必须确定它属于三个类别中的哪一个。 

如果某个职位从未出现在任何 LIS 中，则该职位属于第 1 组。 

如果某个职位至少出现在一个 LIS 中，但存在另一个不使用该职位的 LIS，则该职位属于第 2 组。 

如果每个可能的 LIS 都必须包含该位置，则该位置位于组 3 中。 

数组长度可以达到$10^5$。 任何显式枚举递增子序列的算法都是没有希望的，因为 LIS 的数量可能是指数级的。 甚至一个$O(n^2)$动态规划解决方案的性能约为$10^{10}$最坏情况下的比较，远远超出了极限。 目标复杂度大致为$O(n \log n)$。 

棘手的部分是区分组 2 和组 3。仅仅知道索引属于某个 LIS 是不够的。 我们必须知道是否有任何替代方法可以在不使用该位置的情况下构建 LIS。 

考虑数组：```
1 3 2 5
```LIS 长度为 3。有两种 LIS：```
1 3 5
1 2 5
```包含 3 和 2 的位置属于某些 LIS，但不是所有 LIS。 他们的答案一定是`2`。 

另一个微妙的情况是：```
1 2 3
```只有一个 LIS。 每个位置都属于它，所以答案是：```
333
```仅检查位置是否可以出现在 LIS 中的粗心解决方案会错误地打印`222`。 

另一个重要的例子是：```
2 2 2
```LIS长度为1。每个位置单独形成一个LIS。 没有什么职位是强制性的，因为我们可以选择三个中的任何一个。 正确答案是：```
222
```将所有 LIS-length-1 位置视为强制位置是错误的。 

## 方法

 蛮力的想法在概念上很简单。 生成每个最长递增子序列，记录出现了哪些索引，然后根据包含该索引的 LIS 数量对每个索引进行分类。 这是正确的，因为它直接遵循定义。 

问题在于规模。 即使对于中等投入，LIS 的数量也可能是巨大的。 像这样的数组```
1 2 1 2 1 2 ...
```已经创造了很多选择。 枚举所有 LIS 会呈指数增长。 

关键的观察结果是我们不需要 LIS 本身。 我们只需要有关每个位置在 LIS 中的位置的结构信息。 

让$L_i$是在位置结束的最长递增子序列的长度$i$。 

让$R_i$是从位置开始的最长递增子序列的长度$i$。 

如果 LIS 总长度为$K$，然后定位$i$何时可以属于某个 LIS$$L_i + R_i - 1 = K.$$原因是$L_i$描述了最佳增量链到达$i$,$R_i$描述了最佳的增加链离开$i$，和位置$i$两部分都计算在内。 

这已经将第 1 组与其他组分开。 

剩下的问题是决定一个职位是否是强制性的。 

LIS 上的每个位置都占据一个特定的层，即层$L_i$。 沿着任何 LIS，我们必须从每一层中准确选择一个位置$1,2,\ldots,K$。 

假设所有位置满足$$L_i + R_i - 1 = K$$图层中只有一个位置$t$。 

每个 LIS 必须占据层中的一个位置$t$，并且只有一个候选人。 该位置是不可避免的，属于第三组。 

如果一个层包含两个或多个候选者，则它们中没有一个是单独强制的。 在构建 LIS 时，我们可以从同一层选择另一个候选者。 这些位置属于第 2 组。 

这导致$O(n \log n)$解决方案使用标准耐心排序 LIS 算法两次。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 指数| 指数| 太慢了 |
 | 最佳| O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 计算$L_i$，在每个位置结束的 LIS 长度。 

使用耐心排序技术从左到右处理数组。 对于每个值，通过二分查找找到其在 tails 数组中的插入位置。 插入索引加一为$L_i$。 
2. 计算$R_i$，从每个位置开始的 LIS 长度。 

从右到左处理数组。 对值应用相同的 LIS 过程$-a_i$。 这相当于从位置向右移动时计算递增子序列$i$。 
3.让$$K = \max(L_i).$$这是 LIS 的总长度。 
4. 对于每个位置，检查是否$$L_i + R_i - 1 = K.$$如果不是，该职位不能属于任何 LIS。 将其标记为组`1`。 
5. 对于每个满足上述等式的位置，统计每层中有多少个这样的位置$L_i$。 
6. 对于某些 LIS 上的每个位置：

 如果其图层恰好包含一个有效位置，则将其标记为组`3`。 

否则将其标记为组`2`。 
7. 输出结果字符串。 

### 为什么它有效

 价值观$L_i$和$R_i$描述进入和离开位置的最长递增链$i$。 只有当这两条链组合到全局 LIS 长度时，仓位才能参与 LIS，这正是条件$$L_i + R_i - 1 = K.$$每个 LIS 包含每一层的一个位置。 位置的层数为$L_i$。 在 LIS 中可以出现的位置中，如果某一层仅包含一个候选位置，则每个 LIS 都必须使用该候选位置，因为该层无法跳过。 相反，如果一个层包含多个候选，则不会强制使用单个候选。 将一个候选者替换为另一个候选者可以通过该层保留 LIS 的存在。 因此，唯一层候选者正是属于每个 LIS 的位置。 

## Python 解决方案```python
import sys
from bisect import bisect_left

input = sys.stdin.readline

def solve():
    n = int(input())
    a = list(map(int, input().split()))

    L = [0] * n
    tails = []

    for i, x in enumerate(a):
        pos = bisect_left(tails, x)
        if pos == len(tails):
            tails.append(x)
        else:
            tails[pos] = x
        L[i] = pos + 1

    K = len(tails)

    R = [0] * n
    tails = []

    for i in range(n - 1, -1, -1):
        x = -a[i]
        pos = bisect_left(tails, x)
        if pos == len(tails):
            tails.append(x)
        else:
            tails[pos] = x
        R[i] = pos + 1

    layer_count = [0] * (K + 1)

    for i in range(n):
        if L[i] + R[i] - 1 == K:
            layer_count[L[i]] += 1

    ans = ['1'] * n

    for i in range(n):
        if L[i] + R[i] - 1 != K:
            ans[i] = '1'
        elif layer_count[L[i]] == 1:
            ans[i] = '3'
        else:
            ans[i] = '2'

    print(''.join(ans))

if __name__ == "__main__":
    solve()
```第一个 LIS 遍计算在每个位置结束的最长递增子序列。 tails 数组维护每个 LIS 长度的最小可能结束值。 这是标准$O(n \log n)$LIS 技术。 

第二遍稍微不太明显。 从右到左处理，同时对负值应用相同的逻辑，计算从每个位置开始的最长递增子序列。 使用否定将所需的排序转换为前向传递中使用的相同的二分搜索结构。 

获得后$L$和$R$，条件$$L_i + R_i - 1 = K$$准确识别至少一个 LIS 上的位置。 只有那些位置参与层计数。 

层数数组的索引为$L_i$。 一个常见的错误是计算图层中的所有位置。 我们必须只计算满足 LIS 条件的位置。 不属于 LIS 的职位不得影响强制职位测试。 

## 工作示例

 ### 示例 1

 输入：```
1
4
```| 我| 一个[我] | L[i] | R[i] | 左+右-1 |
 | --- | --- | --- | --- | --- |
 | 1 | 4 | 1 | 1 | 1 |

 这里$K=1$。 

第 1 层仅包含一个有效位置。 

输出：```
3
```这演示了最简单的情况。 唯一的位置属于每个 LIS，因为每个 LIS 都由该单个元素组成。 

### 示例 2

 输入：```
4
1 3 2 5
```| 我| 一个[我] | L[i] | R[i] | 左+右-1 |
 | --- | --- | --- | --- | --- |
 | 1 | 1 | 1 | 3 | 3 |
 | 2 | 3 | 2 | 2 | 3 |
 | 3 | 2 | 2 | 2 | 3 |
 | 4 | 5 | 3 | 1 | 3 |

 LIS 长度为$K=3$。 

按层的有效位置：

 | 层 | 职位 |
 | --- | --- |
 | 1 | {1} |
 | 2 | {2, 3} |
 | 3 | {4} |

 第 1 层和第 3 层包含唯一的候选层，因此位置 1 和 4 是强制性的。 

第 2 层包含两个候选层，因此两者都不是强制性的。 

输出：```
3223
```这个例子说明了为什么仅仅属于 LIS 是不够的。 位置 2 和 3 都出现在某些 LIS 中，但两者都没有出现在所有 LIS 中。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 使用二分搜索进行两次 LIS |
 | 空间| O(n) | 数组 L、R、答案和层数 |

 和$n \le 10^5$， 一个$O(n \log n)$解决方案执行大约几百万次操作，完全符合限制。 内存使用量与数组大小成线性关系，并且远低于 256 MB。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io
from bisect import bisect_left

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    n = int(sys.stdin.readline())
    a = list(map(int, sys.stdin.readline().split()))

    L = [0] * n
    tails = []

    for i, x in enumerate(a):
        p = bisect_left(tails, x)
        if p == len(tails):
            tails.append(x)
        else:
            tails[p] = x
        L[i] = p + 1

    K = len(tails)

    R = [0] * n
    tails = []

    for i in range(n - 1, -1, -1):
        x = -a[i]
        p = bisect_left(tails, x)
        if p == len(tails):
            tails.append(x)
        else:
            tails[p] = x
        R[i] = p + 1

    cnt = [0] * (K + 1)

    for i in range(n):
        if L[i] + R[i] - 1 == K:
            cnt[L[i]] += 1

    ans = []

    for i in range(n):
        if L[i] + R[i] - 1 != K:
            ans.append('1')
        elif cnt[L[i]] == 1:
            ans.append('3')
        else:
            ans.append('2')

    return ''.join(ans)

# provided sample
assert run("1\n4\n") == "3", "sample 1"

# custom cases
assert run("3\n1 2 3\n") == "333", "unique LIS"
assert run("3\n2 2 2\n") == "222", "many LIS of length 1"
assert run("4\n1 3 2 5\n") == "3223", "two middle alternatives"
assert run("5\n5 4 3 2 1\n") == "22222", "all positions form LIS length 1"
assert run("4\n1 2 1 2\n") == "2222", "multiple choices in every layer"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 4`|`3`| 最小尺寸|
 |`1 2 3`|`333`| 独特的LIS |
 |`2 2 2`|`222`| 长度为 1 的多个 LOS |
 |`1 3 2 5`|`3223`| 强制性和可选职位一起|
 |`5 4 3 2 1`|`22222`| 严格递减序列|
 |`1 2 1 2`|`2222`| 每层有多个候选人 |

 ## 边缘情况

 考虑：```
3
2 2 2
```我们得到：```
L = [1, 1, 1]
R = [1, 1, 1]
K = 1
```每个位置都满足$L_i + R_i - 1 = 1$，所以所有位置都属于某个 LIS。 第 1 层包含三个候选者，而不是一个。 该算法输出：```
222
```这是正确的，因为任何单个元素都是 LIS。 

考虑：```
3
1 2 3
```这些值为：```
L = [1, 2, 3]
R = [3, 2, 1]
K = 3
```每一层只包含一个有效位置。 该算法输出：```
333
```每个 LIS 必须使用所有三个位置。 

考虑：```
4
1 3 2 5
```中间位置都位于 LIS 上：```
L = [1, 2, 2, 3]
R = [3, 2, 2, 1]
```第 2 层包含两个有效候选者。 该算法输出：```
3223
```它正确地捕捉到位置 2 和 3 是可以互换的，而位置 1 和 4 是不可避免的。
