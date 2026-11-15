---
title: "CF 6A - 三角形"
description: "我们有四种长度的棍子，我们必须选择其中的三种。 根据这三个长度之间的关系，存在三种可能的结果。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "geometry"]
categories: ["algorithms"]
codeforces_contest: 6
codeforces_index: "A"
codeforces_contest_name: "Codeforces Beta Round 6 (Div. 2 Only)"
rating: 900
weight: 6
solve_time_s: 78
verified: true
draft: false
---
[CF 6A - 三角形](https://codeforces.com/problemset/problem/6/A)

 **评分：** 900
 **标签：** 蛮力，几何
 **求解时间：** 1m 18s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有四种长度的棍子，我们必须选择其中的三种。 根据这三个长度之间的关系，存在三种可能的结果。 

如果所选的木棍可以形成一个面积为正的三角形，我们打印`TRIANGLE`。 从几何角度来说，这意味着两个较小边的总和严格大于最大边。 

如果不可能形成正确的三角形，我们仍然检查木棍是否可以位于一条直线上。 当两个较小边的总和恰好等于最大边时就会发生这种情况。 在这种情况下我们打印`SEGMENT`。 

如果这两个条件对于任何三根棍子的选择都不可能，我们打印`IMPOSSIBLE`。 

输入尺寸很小。 我们只有四个数字，因此需要测试四个不同的三元组。 即使是检查每个组合的强力解决方案也会立即运行。 由于约束如此之小，挑战不是优化，而是正确处理几何条件。 

最常见的错误是混淆了严格和非严格的三角不等式。 正确的三角形需要：$$a + b > c$$对三边进行排序后$c$是最大的。 

退化三角形（该问题称为线段）需要：$$a + b = c$$使用`>=`而不是`>`会错误地将线段分类为三角形。 

考虑输入：```
1 2 3 10
```棍棒`1 2 3`形成一条直线段，因为`1 + 2 = 3`。 正确的输出是：```
SEGMENT
```粗心的实现使用`>=`会错误打印`TRIANGLE`。 

另一个容易犯的错误是只检查一个三元组后过早停止。 例如：```
1 1 2 3
```三重`1 1 2`只是一个片段，但是`1 2 3`是不可能的。 由于任何地方都不存在正确的三角形，所以正确的答案仍然是：```
SEGMENT
```在做出决定之前，我们必须检查所有四个可能的三元组。 

还有一种相反的情况：```
4 2 1 3
```三重`1 2 3`只是一个片段，但是`2 3 4`形成一个有效的三角形，因为`2 + 3 > 4`。 正确答案是：```
TRIANGLE
```立即打印的实现`SEGMENT`看到一个堕落的案例就错了。 正确的三角形始终优先。 

## 方法

 直接的暴力方法是从四个可用的棍子中生成每组三个棍子。 这样的组合只有四种，因此我们可以简单地独立测试每一种。 

对于每个三元组，我们对三个长度进行排序。 排序后，我们只需将两个较小值的总和与最大的值进行比较即可。 

如果：$$a + b > c$$那么我们已经知道答案一定是`TRIANGLE`，因为正确的三角形比其他所有结果具有更高的优先级。 

如果相等成立：$$a + b = c$$然后我们记得一个线段是可能的，但我们仍然继续检查其他三元组，以防稍后出现真正的三角形。 

暴力解决方案已经完全可以接受，因为操作次数是恒定的。 我们只测试四个三元组，每个三元组涉及一小部分三个数字。 

除此之外，没有任何有意义的渐近优化。 关键的观察是输入大小是固定的并且非常小，因此最干净的解决方案也是最好的解决方案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力破解所有三元组 | O(1) | O(1) | O(1) | O(1) | 已接受 |
 | 优化基于观察的检查 | O(1) | O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 将四个棒长度读入数组中。 
2. 从四个可用的棍子中生成三个棍子的每种组合。 由于只有四根棍子，因此正好产生四个三元组。 
3. 对于每个三元组，将三个长度按非递减顺序排序。 
4. 设排序后的边为`a`,`b`， 和`c`， 在哪里`c`是最大的一面。 
5. 如果`a + b > c`，立即打印`TRIANGLE`并停止。 有效的三角形具有最高优先级，因此无需进一步检查。 
6. 如果`a + b == c`，请记住存在退化三角形。 还不要停下来，因为另一个三元组仍然可能形成一个正确的三角形。 
7.检查完所有三元组后，打印`SEGMENT`如果至少发现一个退化三角形。 
8. 否则打印`IMPOSSIBLE`。 

### 为什么它有效

 对每个三元组进行排序可将三角形条件简化为涉及最大边的单个比较。 对于任意三个排序边`a ≤ b ≤ c`，三角不等式只需要检查是否`a + b`大于`c`。 

该算法会检查三根棍子的每种可能选择，因此不会错过有效的配置。 自从`TRIANGLE`优先级高于`SEGMENT`，找到合适的三角形后立即返回是正确的。 如果不存在真三角形，但至少出现一种等式情况，则正确的分类是`SEGMENT`。 如果这两种情况都不发生，则无法形成任何类型的三角形。 

## Python 解决方案```python
import sys
from itertools import combinations

input = sys.stdin.readline

sticks = list(map(int, input().split()))

segment = False

for triple in combinations(sticks, 3):
    a, b, c = sorted(triple)

    if a + b > c:
        print("TRIANGLE")
        sys.exit()

    if a + b == c:
        segment = True

if segment:
    print("SEGMENT")
else:
    print("IMPOSSIBLE")
```解决方案首先读取四个棒的长度。 因为我们需要每组三根棍子，`itertools.combinations`是生成它们的最干净的方法。 

在检查三角形条件之前对每个三元组进行排序。 此步骤至关重要，因为只有在以下情况下比较才能正确进行：`c`是最大的一面。 忘记排序可能会产生不正确的结果。 

第一个条件使用严格的不等式检查正确的三角形。 一旦找到这样的三元组，程序就会打印`TRIANGLE`并立即退出。 后面的三元组不能产生更高优先级的答案。 

第二个条件检查是否相等。 我们没有立即打印结果，而是将结果存储在`segment`旗帜。 这避免了早期的错误，即稍后的三元组仍然可以形成正确的三角形。 

最后，如果没有找到三角形，但至少存在一个线段配置，程序会打印`SEGMENT`。 否则答案是`IMPOSSIBLE`。 

数字非常小，因此 Python 中不可能出现整数溢出。 实现主要是为了使条件顺序正确。 

## 工作示例

 ### 示例 1

 输入：```
4 2 1 3
```| 三重| 排序三重| 检查 | 结果 |
 | --- | --- | --- | --- |
 | (4,2,1) | (4,2,1) | (1,2,4) | 1 + 2 < 4 | 不可能|
 | (4,2,3) | (2,3,4) | 2 + 3 > 4 | 发现三角形|

 算法找到后立即停止`(2,3,4)`因为正确的三角形优先于所有其他结果。 最终的答案是：```
TRIANGLE
```这一跟踪说明了为什么我们在看到一个失败的三元组后就无法停止。 不同选择的棍子可能表现不同。 

### 示例 2

 输入：```
1 2 3 10
```| 三重| 排序三重| 检查 | 结果 |
 | --- | --- | --- | --- |
 | (1,2,3) | (1,2,3) | (1,2,3) | (1,2,3) | 1 + 2 = 3 | 细分 |
 | (1,2,10) | (1,2,10) | 1 + 2 < 10 | 不可能|
 | (1,3,10) | (1,3,10) | 1 + 3 < 10 | 不可能|
 | (2,3,10) | (2,3,10) | 2 + 3 < 10 | 2 + 3 < 10 不可能|

 不存在真正的三角形，但确实存在一种退化情况。 答案变成：```
SEGMENT
```这个例子证实了区分严格不平等和平等的重要性。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(1) | O(1) | 仅检查了四个三元组 |
 | 空间| O(1) | O(1) | 无论输入大小如何，都使用一些变量 |

 该程序执行恒定量的工作，因为输入大小固定为四个数字。 与问题限制相比，运行时间和内存使用实际上是瞬时的。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from itertools import combinations

def solve():
    input = sys.stdin.readline

    sticks = list(map(int, input().split()))

    segment = False

    for triple in combinations(sticks, 3):
        a, b, c = sorted(triple)

        if a + b > c:
            print("TRIANGLE")
            return

        if a + b == c:
            segment = True

    if segment:
        print("SEGMENT")
    else:
        print("IMPOSSIBLE")

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()

    backup_stdout = sys.stdout
    sys.stdout = out

    solve()

    sys.stdout = backup_stdout

    return out.getvalue().strip()

# provided sample
assert run("4 2 1 3\n") == "TRIANGLE", "sample 1"

# custom cases
assert run("1 2 3 10\n") == "SEGMENT", "degenerate triangle exists"
assert run("1 1 3 5\n") == "IMPOSSIBLE", "no valid combination"
assert run("5 5 5 5\n") == "TRIANGLE", "all equal sticks"
assert run("100 1 1 2\n") == "SEGMENT", "boundary equality case"
assert run("2 3 4 9\n") == "TRIANGLE", "one valid triple among failures"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 2 3 10`|`SEGMENT`| 等号不能算作三角形 |
 |`1 1 3 5`|`IMPOSSIBLE`| 没有三元组满足任何条件|
 |`5 5 5 5`|`TRIANGLE`| 等边直角三角形|
 |`100 1 1 2`|`SEGMENT`| 一种退化情况下的巨大不平衡 |
 |`2 3 4 9`|`TRIANGLE`| 以后三连仍有可能成功|

 ## 边缘情况

 考虑输入：```
1 2 3 10
```算法检查`(1,2,3)`第一的。 排序后我们得到`1 2 3`，并且自从`1 + 2 = 3`， 这`segment`标志变成`True`。 

剩下的三元组都严格不满足不等式。 由于没有找到合适的三角形，最终输出为：```
SEGMENT
```这个例子证实了相等性必须与真实三角形分开处理。 

现在考虑：```
4 2 1 3
```三重`(1,2,3)`仅形成一个段，但稍后算法会检查`(2,3,4)`。 自从`2 + 3 > 4`，它立即打印：```
TRIANGLE
```这说明了为什么我们在看到退化三角形后就无法停下来。 稍后的组合仍可能形成正确的组合。 

最后，考虑：```
1 1 3 5
```每个三元组都不满足以下条件：$$a + b \ge c$$该算法从不设置`segment`标记，但从未找到合适的三角形。 最终的答案是：```
IMPOSSIBLE
```这验证了算法正确地拒绝了甚至无法形成直线排列的配置。
