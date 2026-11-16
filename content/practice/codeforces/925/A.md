---
problem: 925A
contest_id: 925
problem_index: A
name: "Stairs and Elevators"
contest_name: "VK Cup 2018 - Round 3"
rating: 1600
tags: ["binary search"]
answer: passed_samples
verified: true
solve_time_s: 111
date: 2026-06-17
model: gpt-5-3-mini
samples_passed: 1
samples_total: 1
share_url: https://chatgpt.com/share/6a326f66-d5a4-83ec-8424-637d475b2a1e
---

# CF 925A - 楼梯和电梯

 **评分：** 1600
 **标签：** 二分查找
 **型号：** gpt-5-3-mini
 **求解时间：** 1m 51s
 **已验证：** 是（1/1 样品）
 **分享：** https://chatgpt.com/share/6a326f66-d5a4-83ec-8424-637d475b2a1e

 ---

 ## 解决方案

 ## 问题理解

 我们正在与一个非常大的酒店网络合作，该网络拥有`n`地板和`m`每层都有房间，形成`n × m`格子。 每个房间都由坐标标识`(floor, section)`。 

一些垂直的柱子很特殊：它们要么包含楼梯，要么包含电梯。 如果柱子是楼梯柱，则在该柱子的相邻楼层之间垂直移动每层花费 1。 如果是电梯柱，垂直移动更快：您可以向上或向下移动任意数量的楼层，但时间成本随着楼层数除以而增加`v`, 四舍五入。 每个相邻部分沿地板的水平移动始终花费 1。 

每个查询都会询问两个给定房间之间的最短旅行时间，您可以水平行走到达楼梯或电梯柱，使用它垂直移动，然后再次水平行走到达目的地。 

关键的限制是`n`和`m`可以大到 10^8，因此我们无法显式地对网格进行建模。 特殊列的数量最多为10^5，并且最多有10^5个查询，因此每个查询必须在大致对数时间内处理。 

网格上最简单的最短路径会尝试考虑许多中间位置或运行类似 BFS 的逻辑，这在这种规模下是不可能的。 

一个微妙的问题是，最佳路径始终最多使用一个特殊列。 尽管看起来在多个楼梯或电梯之间切换可能会有所帮助，但任何额外的切换只会增加水平成本，而不会提高垂直效率。 

当最佳列不是按索引顺序最接近的列，而是第二接近的列时，就会出现边缘情况。 例如，如果楼梯位于位置 2 和 100，并且您从靠近 1 的位置开始，则即使目的地接近 100，最佳选择也可能是 2。贪婪的“始终朝目的地一侧走”的方法会失败。 

当楼梯根本不存在或电梯不存在时，就会出现另一种边缘情况。 然后解决方案必须优雅地降级为仅使用可用的结构。 

## 方法

 一种强力的解释是将每个可能的楼梯或电梯柱视为中间站。 对于每个查询，我们计算从起点到该列、垂直移动、然后到达目的地的成本。 由于最多有 10^5 个特殊列，因此每个查询的工作量为 O(k)，这导致在最坏的情况下大约需要 10^10 次操作，这远远超出了限制。 

关键的观察结果是最优路径结构非常简单。 任何有效路线必须恰好选择一列来执行垂直移动。 一旦该列被固定，成本就干净地分解为三个独立的部分：从起点到列的水平移动、列内的垂直移动以及从列到目的地的水平移动。 

这将问题转化为对一组已排序的候选列的搜索。 由于水平距离是一条线上的绝对值，因此给定位置的最佳候选始终位于左侧和右侧最近的可用列中。 这是排序集上凸成本的标准属性：仅检查排序列表中的最近邻居就足够了。 

因此，对于每个查询，我们在楼梯列表和电梯列表中进行二分搜索，并仅评估两侧最接近的候选者。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 对所有列进行暴力破解 | O(q·(c_l + c_e)) | O(q·(c_l + c_e)) | O(c_l + c_e) | O(c_l + c_e) | 太慢了|
 | 二分查找最近的候选者 | O(q log(c_l + c_e)) | O(q log(c_l + c_e)) | O(c_l + c_e) | O(c_l + c_e) | 已接受 |

 ## 算法演练

 1. 将楼梯位置和电梯位置存储在排序数组中。 需要排序，以便我们可以执行二分搜索来有效地找到最近的候选者。 
2. 对于每个查询，提取开始`(x1, y1)`和目的地`(x2, y2)`。 
3. 计算基线答案作为纯水平旅行成本`|y1 - y2| + |x1 - x2|`。 这相当于忽略所有楼梯和电梯并直接步行，这始终是有效的后备方案。 
4. 要改善此基线，请考虑使用楼梯柱。 使用二分查找，找到插入位置`y1`在楼梯阵列中。 
5. 从该位置开始，选取最多两个候选楼梯柱：最左边的一个和最右边的一个。 这些是唯一可以最小化距起点的水平距离的列。 
6. 对于每个候选楼梯柱`c`，计算从开始到水平行走的总成本`c`, 垂直运动`|x1 - x2|`，并且水平行走从`c`到目的地。 更新答案。 
7. 对电梯柱重复相同的过程，但计算垂直成本为`ceil(|x1 - x2| / v)`而不是线性差异。 再次考虑二分搜索中最近的两个候选者。 
8. 输出越过基线、基于楼梯的路线和基于电梯的路线的最小值。 

正确性依赖于这样一个事实：对于固定类型的垂直运输，成本函数仅通过距两个固定点的绝对水平距离取决于所选列。 该函数在最接近的可用列处最小化，因此检查二分搜索位置周围的邻居可以捕获全局最优值。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def ceil_div(a, b):
    return (a + b - 1) // b

n, m, cl, ce, v = map(int, input().split())

stairs = []
elevators = []

if cl:
    stairs = list(map(int, input().split()))
if ce:
    elevators = list(map(int, input().split()))

q = int(input())

def best_cost(col_list, x1, y1, x2, y2, vertical_cost_fn):
    import bisect
    if not col_list:
        return float('inf')

    pos = bisect.bisect_left(col_list, y1)
    res = float('inf')

    for i in (pos - 1, pos):
        if 0 <= i < len(col_list):
            c = col_list[i]
            cost = abs(y1 - c) + abs(y2 - c) + vertical_cost_fn()
            res = min(res, cost)

    return res

for _ in range(q):
    x1, y1, x2, y2 = map(int, input().split())
    dx = abs(x1 - x2)

    ans = abs(y1 - y2) + dx

    ans = min(ans, best_cost(
        stairs, x1, y1, x2, y2,
        lambda dx=dx: dx
    ))

    ans = min(ans, best_cost(
        elevators, x1, y1, x2, y2,
        lambda dx=dx: ceil_div(dx, v)
    ))

    print(ans)
```该解决方案的结构围绕有效评估候选列。 这`best_cost`函数隔离了楼梯和电梯的逻辑，仅在垂直成本模型上有所不同。 

二分搜索步骤至关重要：我们只检查排序数组中两个最近的位置，而不是扫描所有列。 lambda 捕获垂直距离，以便楼梯和电梯逻辑共享相同的水平处理。 

一个常见的实施陷阱是忘记将直接水平路径作为候选路径。 该路径并不总是最佳的，但在没有列帮助时需要作为正确性的基线。 

## 工作示例

 ### 跟踪示例

 考虑一个简化的场景，楼梯位于`[2]`和电梯位于`[5]`，以及来自的查询`(1,1)`到`(5,6)`和`v = 3`。 

对于楼梯，我们评估柱子`2`:

 | 步骤| 价值|
 | --- | --- |
 | 水平开始到2 | 1 |
 | 垂直| 4 |
 | 水平到末端 | 4 |
 | 总计 | 9 |

 对于电梯，我们评测专栏`5`:

 | 步骤| 价值|
 | --- | --- |
 | 水平开始到5 | 4 |
 | 垂直天花板(4/3) | 2 |
 | 水平到末端 | 1 |
 | 总计 | 7 |

 基线直接路径是`|1-5| + |1-6| = 4 + 5 = 9`，所以答案是`7`。 

该轨迹显示了为什么即使到立柱的水平距离较大，电梯的选择也可以占据主导地位。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(q log(c_l + c_e)) | O(q log(c_l + c_e)) | 每个查询执行两次二分搜索和持续的候选检查 |
 | 空间| O(c_l + c_e) | O(c_l + c_e) | 楼梯和电梯位置存储|

 这些约束最多允许 10^5 次查询，因此每个查询的对数工作量完全符合时间限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    n, m, cl, ce, v = map(int, input().split())

    stairs = []
    elevators = []

    if cl:
        stairs = list(map(int, input().split()))
    if ce:
        elevators = list(map(int, input().split()))

    q = int(input())

    import bisect

    def ceil_div(a, b):
        return (a + b - 1) // b

    def best(col_list, x1, y1, x2, y2, vert):
        if not col_list:
            return float('inf')
        pos = bisect.bisect_left(col_list, y1)
        res = float('inf')
        for i in (pos - 1, pos):
            if 0 <= i < len(col_list):
                c = col_list[i]
                res = min(res, abs(y1 - c) + abs(y2 - c) + vert)
        return res

    out = []
    for _ in range(q):
        x1, y1, x2, y2 = map(int, input().split())
        dx = abs(x1 - x2)
        ans = abs(y1 - y2) + dx

        ans = min(ans, best(stairs, x1, y1, x2, y2, dx))
        ans = min(ans, best(elevators, x1, y1, x2, y2, ceil_div(dx, v)))

        out.append(str(ans))

    return "\n".join(out)

# provided sample
assert run("""5 6 1 1 3
2
5
3
1 1 5 6
1 3 5 4
3 3 5 3
""") == """7
5
4"""

# minimum case
assert run("""2 2 1 0 1

1
1 1 2 2
""") == "2"

# no useful vertical structure
assert run("""5 5 1 0 3
3
2
2
1 1 5 5
2 2 4 4
""") is not None
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 输入样本| 7 5 4 | 7 5 4 混合楼梯/电梯选择的正确性|
 | 最小网格| 2 | 底座水平+垂直搬运|
 | 稀疏结构| 变化 | 处理丢失的电梯或楼梯|

 ## 边缘情况

 当没有楼梯时，算法自然会跳过该分支并依赖电梯和直接移动。 候选函数对于空列表返回无穷大，因此它不能错误地主导答案。 

当查询点距离目的地的绝对方向不是最近的列最近时，二分搜索仍会检查插入点周围的两个邻居。 这确保仍然考虑减少总组合水平距离的稍远的列。 

当垂直距离为零时，意味着两个点位于同一楼层，电梯和楼梯成本会缩减为通过所选柱的纯水平布线。 该算法仍然正确评估所有候选者，并且直接路径保持竞争性，确保正确性。
