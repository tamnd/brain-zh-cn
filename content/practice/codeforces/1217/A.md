---
title: "CF 1217A - 创建角色"
description: "我们被赋予了一个具有两个基本属性的角色：力量和智力。 我们还获得了必须全部分配的额外经验值池。 每一点都可以将力量或智力增加一个单位。"
date: "2026-06-15T18:52:51+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "math"]
categories: ["algorithms"]
codeforces_contest: 1217
codeforces_index: "A"
codeforces_contest_name: "Educational Codeforces Round 72 (Rated for Div. 2)"
rating: 1300
weight: 1217
solve_time_s: 330
verified: true
draft: false
---

[CF 1217A - 创建角色](https://codeforces.com/problemset/problem/1217/A)

 **评分：** 1300
 **标签：** 二分查找，数学
 **求解时间：** 5m 30s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被赋予了一个具有两个基本属性的角色：力量和智力。 我们还获得了必须全部分配的额外经验值池。 每一点都可以将力量或智力增加一个单位。 分配所有点后，我们获得最终的一对值。 

任务不是计算单个最佳构建，而是计算在约束下有多少种不同的最终配置有效：在花费所有经验点后，所得的强度必须严格大于所得的智力。 如果最终力量或最终智力不同，则两种配置被视为不同。 

关键结构是，每个有效结果完全取决于我们分配给强度的分数。 一旦确定，智力就会自动确定，因为所有点都必须使用。 

所有参数的约束最多为 10^8，最多有 100 个测试用例。 这立即排除了任何显式尝试所有分布的方法，因为即使在最坏的情况下迭代每个测试用例的 exp 也可能已经达到 10^10 次操作。 每个查询的解决方案必须是 O(1)。 

当没有有效的分布时，会出现微妙的边缘情况。 当智力相对于力量而言太大时，就会发生这种情况，因此即使将所有经验都投入到力量中并不会使力量严格地变得更大。 另一种边界情况是当 exp 为零时，只有一个可能的构建，并且仅当初始不等式已经成立时它才有效。 

## 方法

 直接方法会尝试所有可能的经验点分割。 如果我们将 x 点分配给力量，将 exp - x 分配给智力，那么最终值将变为：

 强度 = str + x

 智力 = int + (exp - x)

 我们可以将 x 从 0 迭代到 exp 并检查每种情况的不等式。 这是正确的，因为它枚举了所有可能的分布，但它在 exp 中是线性的。 当 exp 达到 10^8 时，这变得完全不可行。 

关键的观察结果是不等式约束可以重写为 x 的线性不等式。 这将问题转化为计算有界区间内的整数解。 一旦我们这样做了，我们只需要找到满足约束的 x 的范围，然后计算其中有多少个整数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(exp) | O(1) | O(1) | 太慢了 |
 | 最佳| O(1) | O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 我们用 x 表示分配给力量的经验值。 然后智力获得exp - x点。 

1. 将最终属性表示为方程：

 力量=str+x，智力=int+exp-x。 
2. 将条件强度>智力转化为不等式：

 str + x > int + exp - x。 
3. 重新排列一侧涉及 x 的所有内容：

 2x > int + exp - 字符串。 
4. 求解 x 作为整数下界：

 x > (int + exp - str) / 2。 
5. 将严格不等式转换为最小整数x：

 x_min = 下限((int + exp - str) / 2) + 1。 
6. 根据 x 的定义方式强制实施可行性约束：

 0 ≤ x ≤ exp。 
7. 有效构建的数量是区间 [x_min, exp] 的大小（如果存在）。 

为什么它有效：每个有效的构建都对应于 [0, exp] 中的一个整数 x。 不等式简化为单个线性约束，因此有效的构建集变成了连续的整数区间。 计算解决方案变成计算该区间内的整数点，并且没有两个不同的 x 值会产生相同的（力量、智力）对。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    T = int(input())
    out = []
    
    for _ in range(T):
        str_val, int_val, exp = map(int, input().split())
        
        # Solve inequality:
        # str + x > int + (exp - x)
        # 2x > int + exp - str
        
        rhs = int_val + exp - str_val
        
        # minimal integer x satisfying strict inequality
        # x > rhs / 2
        x_min = rhs // 2 + 1
        
        if x_min < 0:
            x_min = 0
        
        if x_min > exp:
            out.append("0")
        else:
            out.append(str(exp - x_min + 1))
    
    print("\n".join(out))

if __name__ == "__main__":
    solve()
```实现的核心是计算x的最小有效值。 该不等式产生严格的半界，因此我们使用整数除法小心地对其进行转换。 因为 Python 趋于负无穷大，所以使用`rhs // 2 + 1`正确处理正向和负向 rhs 情况。 

计算后`x_min`，我们将其钳位到有效域 [0, exp]。 如果超过 exp，则不存在有效配置。 否则，从 x_min 到 exp 的每个整数都对应一个有效的构建，因此我们直接对它们进行计数。 

## 工作示例

 ### 示例 1

 输入：```
str = 5, int = 3, exp = 4
```我们计算 rhs = 3 + 4 - 5 = 2。 

| x| 实力| 情报| 有效的？ |
 | ---| ---| ---| ---|
 | 0 | 5 | 7 | 没有|
 | 1 | 6 | 6 | 没有|
 | 2 | 7 | 5 | 是的 |
 | 3 | 8 | 4 | 是的 |
 | 4 | 9 | 3 | 是的 |

 有效的 x 值为 2、3、4，提供 3 种配置。 

这证实了有效的解决方案形成了范围的连续后缀。 

### 示例 2

 输入：```
str = 2, int = 1, exp = 0
```rhs = 1 + 0 - 2 = -1，因此已经满足不等式。 

| x| 实力| 情报| 有效的？ |
 | ---| ---| ---| ---|
 | 0 | 2 | 1 | 是的 |

 仅存在一种配置，与 exp 强制 x = 0 的事实相匹配。 

这表明该算法正确处理了零经验边界情况。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(T)| 每个测试用例都使用恒定时间算术来解决 |
 | 空间| O(1) | O(1) | 只存储了几个整型变量 |

 这些约束允许最多 100 个测试用例，其值最多为 10^8，因此每个查询解决方案的恒定时间是足够且必要的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    T = int(input())
    res = []
    for _ in range(T):
        a, b, c = map(int, input().split())
        rhs = b + c - a
        x_min = rhs // 2 + 1
        if x_min < 0:
            x_min = 0
        if x_min > c:
            res.append("0")
        else:
            res.append(str(c - x_min + 1))
    return "\n".join(res)

# provided samples
assert run("""4
5 3 4
2 1 0
3 5 5
4 10 6
""") == """3
1
2
0"""

# minimum exp
assert run("""1
5 1 0
""") == "1"

# no valid configuration
assert run("""1
1 10 0
""") == "0"

# all allocations valid
assert run("""1
10 1 5
""") == "6"

# boundary equality case
assert run("""1
5 3 0
""") == "1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 样品组| 给定| 混合情况的正确性|
 | 5 1 0 | 5 1 0 1 | exp = 0 边界 |
 | 1 10 0 | 1 10 0 0 | 不可能的不平等|
 | 10 1 5 | 10 1 5 6 | 全范围内的所有 x 均有效 |
 | 5 3 0 | 5 3 0 1 | 没有灵活性的平等处理|

 ## 边缘情况

 当 exp 为零时，x 被迫为零。 该算法根据不等式设置 x_min，然后将其钳入 [0, exp]。 如果约束允许 x = 0，则仅计算一次构建； 否则，x_min 超过 exp 并且答案为零。 

当智力远大于力量时，rhs 就会变大且为正值，从而使 x_min 超过 exp。 在这种情况下，区间 [x_min, exp] 为空，算法无需迭代即可正确返回零。 

当强度已经很大时，rhs 变为负数，并且 x_min 计算为负数。 将其限制为零可确保我们计算所有可能的分配，符合每次拆分都保持强度优势的事实。
