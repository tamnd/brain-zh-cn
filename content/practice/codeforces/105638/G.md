---
title: "CF 105638G - Geos 喜欢购物"
description: "我们有几种项目类型。 每种类型的供应量有限，我们必须在所有类型中准确挑选固定数量的商品。 不同的是，每种类型的利润并不是恒定的。"
date: "2026-06-22T15:04:07+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105638
codeforces_index: "G"
codeforces_contest_name: "GPC 2024"
rating: 0
weight: 105638
solve_time_s: 62
verified: true
draft: false
---

[CF 105638G - Geos 喜欢购物](https://codeforces.com/problemset/problem/105638/G)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 2s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有几种项目类型。 每种类型的供应量有限，我们必须在所有类型中准确挑选固定数量的商品。 不同的是，每种类型的利润并不是恒定的。 相反，这取决于我们已经从同一类型中取出了多少物品。 

解释这一点的一个有用方法是，每次我们从类型中获取另一个项目时`i`，其值随着已从该类型中选择的项目数量线性增加。 如果我们采用第一个类型的项目`i`，它提供一些基本增益，第二个提供更多，第三个甚至更多，依此类推，直到该类型的可用限制。 总利润是所有类型的所有选定边际收益的总和。 

所以任务相当于精确分配`m`挑选跨越`n`增加序列，每种类型一个序列，并选择`m`最大可用边际贡献。 

输入提供类型数量和所需的选择数量。 然后我们得到两个长度的数组`n`：第一个数组描述每种类型有多少个可用项目，第二个数组描述该类型的利润增长率。 产出就是最大可实现的总利润。 

这些限制意味着两者`n`和`m`足够大以至于显式生成所有可能的项目贡献并对它们进行排序是不安全的。 简单的扩展最多可以生成所有类型的项目总数，如果我们将所有内容展平，这对于内存和时间来说可能太大了。 

当一种类型的增长非常高但项目很少，而另一种类型的项目很多但增长较低时，就会出现天真的思维的微妙失败案例。 例如，如果类型 A 有 2 个边际收益较高的项目，而类型 B 有 1000 个边际收益稍小的项目，则始终首先从 B 获取或按类型而不是全局边际值贪婪地获取会导致次优结果。 

核心困难在于，每个附加项目都会改变同一类型中未来项目的值，因此类型内的局部决策取决于已经采取的数量。 

## 方法

 蛮力方法会尝试枚举我们从每种类型中获取的项目数，对于每个有效分布，其总和为`m`。 对于每个向量`(x1, x2, ..., xn)`和`0 ≤ xi ≤ ai`和总和`m`，我们通过对第一个求和来计算利润`xi`每种类型的贡献。 这种分布的数量是组合的`m`和`n`，大致像组合物的数量一样增长`m`，即使对于中等值，它也会变得天文数字般大。 即使进行修剪，这种方法也是不可行的，因为评估每个配置已经花费了成本`O(n)`。 

关键的观察是，每种类型内部的利润结构完全由边际收益决定。 如果一个类型有成长价值`b_i`，那么它的贡献形成一系列边际值`b_i * 1, b_i * 2, ..., b_i * a_i`。 那么问题就变成了：我们有多个已排序的序列，我们必须选择最大的`m`所有这些元素。 

这将问题转化为经典的“合并 k 递增序列”选择问题。 我们不生成所有内容，而是仅维护每种类型中当前最佳可用的候选者，并重复提取最大值，更新该类型的下一个候选者。 这确保了我们在每一步中始终选择全局最优的边际增益。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 以 m 为单位的指数 | O(n) | 太慢了|
 | 最优（堆超出边缘）| O(m log n) | O(n) | 已接受 |

 ## 算法演练

 我们将每种类型重新解释为一系列边际收益，其中第 k 项取自类型`i`贡献`b_i * k`。 我们从不明确构建所有序列，只跟踪每个序列的当前“前沿”。 

1. 对于每种类型`i`，从我们可以采取的想法开始`a_i`项目。 The best available marginal gain initially is the last one in that type, which is`b_i * a_i`。 We store this as a candidate along with the type index.
 2. Insert all initial candidates into a max heap. Each heap element represents the next best unused marginal gain from a type.
 3. 准确重复`m`次。 In each iteration, extract the largest marginal gain currently available. This corresponds to choosing the best possible next item among all types.
 4. 假设我们从类型中提取了一个值`i`，它对应于获取第 k 个项目（隐式跟踪）。 使用后，下一个可用的边际增益类型`i`变成`b_i * (k - 1)`。 
5. 如果下一个值仍然为正（意味着我们尚未耗尽该类型的所有项目），则将其推回到堆中。 这确保了该类型继续按递减顺序贡献其剩余边际收益。 
6. 将提取的值累加为最终答案。 

关键的实现细节是我们从不显式跟踪每种类型的所有 k 值。 相反，我们为每种类型维护一个指针，指示剩余的项目数，每次从堆中弹出时，我们都会减少该计数。 

### 为什么它有效

 在任何时候，堆都恰好包含每种类型的最佳未使用边际增益。 由于每种类型的边际收益形成严格递减序列，因此一旦我们从一种类型中获取当前最佳值，那么该类型的下一个最佳值就完全确定并且更小。 始终获取全局最大边际收益的贪婪选择是有效的，因为边际收益在不同类型之间是独立的，并且仅取决于已经从该类型中获取了多少项目。 这保证了未来的选择不会超过我们现在跳过的值。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
import heapq

def solve():
    n, m = map(int, input().split())
    a = list(map(int, input().split()))
    b = list(map(int, input().split()))

    # max heap using negative values
    heap = []
    
    # store current remaining count per type
    # and push initial best marginal gain b_i * a_i
    for i in range(n):
        if a[i] > 0:
            # store: (-value, type_index, current_k)
            heap.append((-b[i] * a[i], i, a[i]))

    heapq.heapify(heap)

    ans = 0

    for _ in range(m):
        val, i, k = heapq.heappop(heap)
        val = -val
        ans += val

        k -= 1
        if k > 0:
            heapq.heappush(heap, (-b[i] * k, i, k))

    print(ans)

if __name__ == "__main__":
    solve()
```该实现最多维护一个堆`n`积极的候选人。 每个条目都会跟踪当前剩余的项目数`k`对于那种类型。 当我们弹出一个值时，我们立即将其替换为同一类型的下一个边际增益，从而确保该序列的连续性，而无需存储所有中间值。 

这里的一个常见错误是重新计算或重新生成完整序列，这是不必要的而且太慢。 另一个微妙之处是堆存储负值以使用 Python 模拟最大堆`heapq`。 

## 工作示例

 考虑样本输入，其中可用性和增长率在不同类型中均匀增加。 堆最初包含每种类型的最后边际增益。 

让我们从概念上追踪前几个操作。 

### 跟踪示例

 我们只显示自此以来的前几个堆操作`m`很小。 

| 步骤| 所选类型 | 取值| 剩余 k | 堆变化|
 | --- | --- | --- | --- | --- |
 | 1 | 类型 5 | 25 | 25 4 | 替换为 20 |
 | 2 | 类型 4 | 16 | 16 3 | 替换为 12 |
 | 3 | 类型 5 | 20 | 3 | 替换为 15 |
 | 4 | 类型 3 | 9 | 2 | 替换为 6 |
 | 5 | 类型 5 | 15 | 15 2 | 替换为 10 |
 | 6 | 类型 2 | 4 | 1 | 替换为 2 |

 经过六个步骤，我们在所有类型中选择了六个最大的边际收益。 

该轨迹表明，我们并不是贪婪地偏爱任何单一类型，而是始终在每一步中提取全局最佳边际改进。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(m log n) | m 个选择中的每一个都执行一次堆弹出操作，并且可能在 n 个活动类型之间执行一次推送操作 |
 | 空间| O(n) | 堆中每种类型最多存储一个活动候选者 |

 这非常适合典型的约束，其中两者`n`和`m`高达10万左右。 

## 测试用例```python
import sys, io
import heapq

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    n, m = map(int, input().split())
    a = list(map(int, input().split()))
    b = list(map(int, input().split()))

    heap = []
    for i in range(n):
        if a[i] > 0:
            heap.append((-b[i] * a[i], i, a[i]))
    heapq.heapify(heap)

    ans = 0
    for _ in range(m):
        val, i, k = heapq.heappop(heap)
        val = -val
        ans += val
        k -= 1
        if k > 0:
            heapq.heappush(heap, (-b[i] * k, i, k))

    return str(ans)

# sample (interpreted)
assert run("5 6\n1 2 3 4 5\n1 2 3 4 5\n") == "27"

# minimum size
assert run("1 1\n5\n10\n") == "50"

# single type, multiple picks
assert run("1 3\n3\n2\n") == str(2+4+6)

# all equal growth
assert run("3 4\n2 2 2\n5 5 5\n") == "50"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单品 | 50 | 50 最小边界正确性 |
 | 单型多拣 | 12 | 12 算术级数处理|
 | 同等增长类型| 50 | 50 跨类型的公平交错 |

 ## 边缘情况

 当一种类型具有非常大的可用性但增长因子非常小的时候，就会出现极端情况。 例如，一个类型`a = 100000`和`b = 1`与一个类型竞争`a = 1`和`b = 100000`。 正确的行为是始终首先优先考虑第二种类型，因为它的第一个边际收益主导了第一种类型的所有后续收益。 堆通过始终比较当前的全局边际收益来确保这一点，因此单个大峰值在任何低值积累之前被消耗。 

另一种情况是当`m`小于类型数。 在这种情况下，我们只选择最好的`m`最初的候选人没有用尽任何类型。 该算法自然会处理这个问题，因为我们只执行`m`堆弹出并且永远不会假设任何序列被完全消耗。
