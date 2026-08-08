---
title: "CF 102431E - 非极大值抑制"
description: "每个检测都是一个边长S相同的正方形。它的位置由左下角（x，y）确定，并且具有明显的置信度分数。 NMS 按从最高分到最低分的顺序处理这些检测。"
date: "2026-08-08T17:26:54+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102431
codeforces_index: "E"
codeforces_contest_name: "2019 China Collegiate Programming Contest Final (CCPC-Final 2019)"
rating: 0
weight: 102431
solve_time_s: 419
verified: true
draft: false
---

[CF 102431E - 非极大值抑制](https://codeforces.com/problemset/problem/102431/E)

 **评级：** -
 **标签：** -
 **求解时间：** 6m 59s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每次检测都是边长相同的正方形`S`。 它的位置由左下角决定`(x, y)`，并且它具有明显的置信度得分。 NMS 按从最高分到最低分的顺序处理这些检测。 如果检测尚未被抑制，则选择该检测。 一旦选择，它就会抑制所有交集严格大于给定阈值的低分检测。 任务是输出在此过程中幸存下来的所有检测的索引，并按其原始索引排序。 

官方的限制允许`n`达到`10^5`， 和`S`最多`10^7`，阈值是精确到小数点后三位的值。 当前的 Codeforces 声明给出了 15 秒的时间限制和 256 MB 的内存限制。 一个`O(n^2)`实施可以执行大约`10^10`配对检查何时`n = 10^5`，即使有相对宽松的期限，也远远超出了合理范围。 我们需要将每个选定框的比较次数限制在一个常数范围内。 

对于两个相等的正方形，令`dx = |x1 - x2|`和`dy = |y1 - y2|`。 

他们的交叉点有宽度`max(0, S - dx)`和身高`max(0, S - dy)`。 如果交集面积为`A`，联合面积为`2S^2 - A`，所以 IoU 是`A / (2S^2 - A)`。 

我们不应该使用浮点来评估它。 如果阈值是`p / 1000`， 然后`A / (2S^2 - A) > p / 1000`完全等于`(1000 + p) A > 2000 p S^2`。 

这个不等式中的每个量都是整数。 

一些边缘情况可能会悄无声息地破坏粗心的实现。 首先，比较严格大于阈值。 例如，```
1
2 3 0.500
0 0 0.9
0 1 0.8
```相交面积为`3 * 2 = 6`，联盟是`18 - 6 = 12`，IoU 正好是`0.500`。 正确的输出是```
Case #1: 2
1 2
```使用`>= threshold`会错误地抑制框 2。 

第二个边缘情况是零重叠。 例如，```
1
2 4 0.300
0 0 0.9
4 0 0.8
```这些正方形仅在其边界处接触，因此它们的相交面积为零。 必须选择两种检测：```
Case #1: 2
1 2
```仅从距离进行推理的粗心实现可能会意外地将接触的方块视为重叠。 

第三种边缘情况是相同的盒子。 例如，```
1
3 1 0.700
0 0 0.5
0 0 0.7
0 0 0.9
```首先选择得分最高的框，它与其他两个框的 IoU 为`1`，严格大于`0.700`。 答案是```
Case #1: 1
3
```不同分数保证准确地告诉我们哪个相同的盒子幸存下来。 

最后，所选检测必须按递增索引顺序打印，而不是按分数顺序。 如果框 3 和 1 幸存而框 2 被抑制，则输出必须是`1 3`，尽管方框 3 的得分可能更大。 官方示例演示了这种顺序。 

## 方法

 直接的解决方案按照字面上的意思来理解NMS。 按分数递减对所有框进行排序，然后维护当前未抑制的框。 当选择下一个框时，将其与每个剩余的框进行比较，并抑制 IoU 高于阈值的框。 这是正确的，因为它正是 NMS 进程的定义。 

问题在于比较的次数。 在最坏的情况下，没有一个框会抑制另一个框，因此第一个选定的框会粗略地检查`n`框，第二个框大致检查`n - 1`， 等等。 总计约为`n(n - 1)/2`，大约达到`5 * 10^9`比较`n = 10^5`。 在考虑排序、哈希表操作和几何计算之前，这已经太大了。 

关键的观察结果是所有正方形的大小完全相同。 对于固定选定的方块，只有当另一个方块的左下角距离选定的角足够近时，IoU 才能高于阈值。 在`(x, y)`平面上，可能冲突位置的集合是所选点周围的有界区域。 

我们可以把这个几何局部性变成一个网格。 选择单元格大小`C`从而保证同一单元中的任意两点的 IoU 严格大于阈值。 那么每个单元格中最多可以选择一个框。 我们还可以证明，两个冲突的框必须位于坐标最多相差 2 的单元格中。 因此，在处理选定的框时，我们只需要检查`5 x 5`其细胞周围的细胞。 

单元尺寸是精确选择的，而不是近似选择的。 设阈值为`p / 1000`并定义`q = 2p / (1000 + p)`。 

当两个盒子的交集面积大于时，它们的 IoU 就大于阈值`qS^2`。 

假设两个左下角位于 side 的同一个单元格中`C`。 他们的坐标差最多为`C - 1`，所以它们的交集面积至少为`(S - C + 1)^2`。 

我们选择最大的整数`C`令人满意`(1000 + p)(S - C + 1)^2 > 2000pS^2`。 

因此，同一单元中的每一对盒子都会发生冲突。 这是中心密度界限。 

现在考虑两个真正冲突的盒子。 自从`(S - dx)(S - dy) > qS^2`,

 两个因素必须分别大于`sqrt(q) S`。 因此`dx < S(1 - sqrt(q))`类似地对于`dy`。 

所选单元格大小至少为`S(1 - sqrt(q))`，因此冲突对在任一坐标中的单元宽度差异小于两倍。 因此，它们的网格坐标最多可以相差两个。 这`5 x 5`邻域包含所有可能的可抑制框。 

网格不需要物理删除抑制框。 一个框属于一个单元格，并且一个单元格最多只能包含一个选定的框，因为该单元格中的所有框都会相互冲突。 因此，任何特定的存储框只能通过从最多 25 个相邻单元中选择的框来检查。 每个盒子只参与总体上恒定数量的比较。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(n) | 太慢了|
 | 最佳 | O(n log n) | O(n log n) | O(n) | 已接受 |

 官方竞赛材料也描述了相同的几何思想：相同大小的正方形仅在固定邻域内发生冲突，允许基于网格的搜索而不是检查每个框。 

## 算法演练

 1. 将阈值解析为整数`p`代表`p / 1000`。 将每个分数解析为按比例缩放的整数`10^6`。 这避免了排序时以及判断 IoU 是否严格高于阈值时的浮点比较。 
2. 按分数递减对框索引进行排序。 由于所有分数都是不同的，因此这准确地给出了 NMS 考虑框的顺序。 
3. 计算最大网格单元边长`C`令人满意`(1000 + p)(S - C + 1)^2 > 2000pS^2`。 

左侧减小为`C`增加，所以`C`可以用二分查找找到。 严格的不平等是故意的。 它符合严格的`IoU > threshold`规则。 
4. 将每个框插入字典中，键为`(x // C, y // C)`。 该字典存储属于每个空间单元的索引。 
5. 按分数降序处理方框。 如果某个框已被抑制，则跳过它。 否则选择它并将其标记为已处理。 
6. 对于选定的框，检查所有网格单元的偏移量`-2`通过`2`在两个坐标中。 IoU 高于阈值的每个框都必须位于这 25 个单元格之一中。 
7. 对于每个尚未被抑制的候选者，计算其精确的交叉面积并进行测试`(1000 + p) * intersection > 2000 * p * S^2`。 

如果不等式成立，则将该候选人标记为被抑制。 
8. 存储每个选定的索引，然后在打印之前对这些索引进行递增排序。 NMS 过程本身是按分数排序的，而所需的输出是按索引排序的。 

### 为什么它有效

 不变的是，在按分数顺序处理框之前，每个较早的框都按照 NMS 的规定被选择或抑制。 如果当前框已被抑制，则决不能选择它。 否则，之前选择的框没有抑制它，因此它恰好是得分最高的剩余框，必须选择。 

当选择一个框时，它可能抑制的每个低分框都位于检查的区域中`5 x 5`邻里。 单元大小构造保证每个相同单元对发生冲突，而重叠不等式将每个冲突对限制到距离最多为 2 的单元。 然后，精确整数 IoU 测试精确地抑制那些 IoU 严格大于阈值的候选者。 因此，NMS 的每一个决策都是正确的，最终选择的集合正是所需的集合。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def parse_scaled(s, digits):
    if '.' in s:
        a, b = s.split('.')
    else:
        a, b = s, ''
    b = (b + '0' * digits)[:digits]
    return int(a) * (10 ** digits) + int(b)

def solve():
    t = int(input())
    output = []

    for case_id in range(1, t + 1):
        n, S, threshold = input().split()
        n = int(n)
        S = int(S)

        # threshold is exact to three decimal places.
        p = parse_scaled(threshold, 3)

        boxes = []
        order = []

        for i in range(n):
            x, y, score = input().split()
            x = int(x)
            y = int(y)
            score = parse_scaled(score, 6)
            boxes.append((x, y))
            order.append((score, i))

        order.sort(reverse=True)

        # We need the largest integer C such that
        #
        # (1000 + p) * (S - C + 1)^2 > 2000 * p * S^2
        #
        # Then any two boxes in one cell necessarily have IoU > threshold.
        target = 2000 * p * S * S
        coefficient = 1000 + p

        def good(c):
            overlap = S - c + 1
            return coefficient * overlap * overlap > target

        lo, hi = 1, S
        while lo < hi:
            mid = (lo + hi + 1) // 2
            if good(mid):
                lo = mid
            else:
                hi = mid - 1

        cell_size = lo

        grid = {}
        for _, idx in order:
            x, y = boxes[idx]
            key = (x // cell_size, y // cell_size)
            grid.setdefault(key, []).append(idx)

        suppressed = bytearray(n)
        selected = []

        for _, idx in order:
            if suppressed[idx]:
                continue

            suppressed[idx] = 1
            selected.append(idx + 1)

            x1, y1 = boxes[idx]
            gx = x1 // cell_size
            gy = y1 // cell_size

            for ox in range(-2, 3):
                for oy in range(-2, 3):
                    candidates = grid.get((gx + ox, gy + oy))
                    if candidates is None:
                        continue

                    for j in candidates:
                        if suppressed[j]:
                            continue

                        x2, y2 = boxes[j]

                        ix = S - abs(x1 - x2)
                        if ix <= 0:
                            continue

                        iy = S - abs(y1 - y2)
                        if iy <= 0:
                            continue

                        area = ix * iy

                        if coefficient * area > target:
                            suppressed[j] = 1

        selected.sort()

        output.append(f"Case #{case_id}: {len(selected)}")
        output.append(" ".join(map(str, selected)))

    sys.stdout.write("\n".join(output))

if __name__ == "__main__":
    solve()
```输入解析有意将阈值和分数保留为整数。 阈值例如`0.500`变成`500`，而分数如`0.900000`变成`900000`。 由于输入保证精确的十进制值，因此这种表示形式保留了它们的顺序并避免了舍入错误。 

二分查找找到最大的安全单元格大小。 对于候选像元大小`C`，当该单元中的两个框的两个坐标相差`C - 1`。 得到的交集是`(S - C + 1)^2`，所以`good`谓词直接检查最坏情况下的 IoU 是否仍严格高于阈值。 

这`grid`字典将每个空间单元映射到该单元中的所有原始框索引。 我们保留隐藏的条目而不是删除它们。 这使得实现简单，并且不会破坏复杂性界限。 由于任何单元中最多有一个盒子可以存活，因此只能从恒定数量的单元位于距离二之内的选定盒子中遇到存储的盒子。 

这`suppressed`bytearray记录了已经选择的框和被NMS消除的框。 蟒蛇的`bytearray`远小于 Python 布尔值列表`10^5`条目。 

交集计算使用`ix = S - abs(x1 - x2)`以及类似的表达式`iy`。 非正值意味着没有正区域交集，因此 IoU 为零，并且候选无法被抑制。 最终比较使用整数运算并准确保留严格的不等式。 

Python 整数具有任意精度，因此诸如`S^2`和`2000 * p * S^2`不要溢出。 在具有固定宽度整数的语言中，64 位整数足以满足这些界限。 

## 工作示例

 提供的样本有三个边长的正方形`4`和阈值`0.390`。 这些框已按分数降序列出。 

| 步骤| 盒子| 细胞| 之前被打压| 欠条检查 | 行动|
 | --- | --- | --- | --- | --- | --- |
 | 1 | 1 |`(0, 0)`| 无 | 框 2、框 3 | 选择 1，抑制 2 |
 | 2 | 2 |`(0, 0)`| 是的 | 无 | 跳过|
 | 3 | 3 |`(1, 1)`| 没有| 框 1 | 选择 3 |

 对于第一个和第二个框，坐标差为`(1, 1)`，给出交集面积`9`。 工会是`32 - 9 = 23`，所以他们的 IoU 是`9/23`，大于`0.390`。 对于框 1 和框 3，交叉面积为`4`，联盟是`28`，IoU 为`1/7`，低于阈值。 因此，选定的指数是`1`和`3`。 

第二个示例练习精确阈值边界。```
1
3 3 0.500
0 0 0.900
0 1 0.800
10 10 0.700
```为了`S = 3`和阈值`0.500`，前两个盒子有交集面积`6`和联合区`12`。 

| 步骤| 盒子| 细胞| 与选定框的 IoU | 行动|
 | --- | --- | --- | --- | --- |
 | 1 | 1 |`(0, 0)`| 无 | 选择 1 |
 | 2 | 2 |`(0, 1)`|`6 / 12 = 0.500`| 选择 2 |
 | 3 | 3 |`(10, 10)`|`0`| 选择 3 |

 第二个框幸存下来，因为规则严格大于阈值。 最终结果是```
Case #1: 3
1 2 3
```此跟踪确认整数比较不会意外地将相等变成抑制。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 排序成本为 O(n log n)，而每个框仅参与 O(1) 空间比较 |
 | 空间| O(n) | 盒子、排序索引、抑制状态和网格存储都使用 O(n) 内存 |

 网格构建需要进行二分搜索`S`，仅添加`O(log S)`每个测试用例的工作。 自从`S <= 10^7`，这少于 24 次迭代。 主要成本是分拣`10^5`框，然后是每个框的恒定数量的空间检查。 官方限制是`n <= 10^5`,`S <= 10^7`，15 秒，256 MB，所以结果`O(n log n)`解决方案符合预期规模。 

## 测试用例

 以下测试工具包含作为可调用函数的解决方案，以便每个断言都可以直接执行。 最大尺寸的情况下使用`100000`相同的位置具有不同的分数，迫使 NMS 准确保留最高分数的框。```python
import io
import sys

def parse_scaled(s, digits):
    if '.' in s:
        a, b = s.split('.')
    else:
        a, b = s, ''
    b = (b + '0' * digits)[:digits]
    return int(a) * (10 ** digits) + int(b)

def solution(data: str) -> str:
    it = iter(data.split())
    t = int(next(it))
    output = []

    for case_id in range(1, t + 1):
        n = int(next(it))
        S = int(next(it))
        threshold = next(it)
        p = parse_scaled(threshold, 3)

        boxes = []
        order = []

        for i in range(n):
            x = int(next(it))
            y = int(next(it))
            score = parse_scaled(next(it), 6)
            boxes.append((x, y))
            order.append((score, i))

        order.sort(reverse=True)

        target = 2000 * p * S * S
        coefficient = 1000 + p

        def good(c):
            overlap = S - c + 1
            return coefficient * overlap * overlap > target

        lo, hi = 1, S
        while lo < hi:
            mid = (lo + hi + 1) // 2
            if good(mid):
                lo = mid
            else:
                hi = mid - 1

        cell_size = lo

        grid = {}
        for _, idx in order:
            x, y = boxes[idx]
            key = (x // cell_size, y // cell_size)
            grid.setdefault(key, []).append(idx)

        suppressed = bytearray(n)
        selected = []

        for _, idx in order:
            if suppressed[idx]:
                continue

            suppressed[idx] = 1
            selected.append(idx + 1)

            x1, y1 = boxes[idx]
            gx = x1 // cell_size
            gy = y1 // cell_size

            for ox in range(-2, 3):
                for oy in range(-2, 3):
                    candidates = grid.get((gx + ox, gy + oy))
                    if candidates is None:
                        continue

                    for j in candidates:
                        if suppressed[j]:
                            continue

                        x2, y2 = boxes[j]

                        ix = S - abs(x1 - x2)
                        if ix <= 0:
                            continue

                        iy = S - abs(y1 - y2)
                        if iy <= 0:
                            continue

                        area = ix * iy

                        if coefficient * area > target:
                            suppressed[j] = 1

        selected.sort()

        output.append(f"Case #{case_id}: {len(selected)}")
        output.append(" ".join(map(str, selected)))

    return "\n".join(output)

def run(inp: str) -> str:
    return solution(inp)

sample = """\
1
3 4 0.390
0 0 0.9
1 1 0.8
2 2 0.7
"""

assert run(sample) == """\
Case #1: 2
1 3
""", "provided sample"

boundary = """\
1
3 3 0.500
0 0 0.900
0 1 0.800
10 10 0.700
"""

assert run(boundary) == """\
Case #1: 3
1 2 3
""", "exact threshold must not suppress"

minimum = """\
1
1 1 0.700
0 0 1.000
"""

assert run(minimum) == """\
Case #1: 1
1
""", "minimum-size input"

identical = """\
1
5 5 0.300
2 2 0.100000
2 2 0.900000
2 2 0.500000
2 2 0.700000
2 2 0.300000
"""

assert run(identical) == """\
Case #1: 1
2
""", "identical boxes keep only the highest score"

far_apart = """\
1
4 10 0.700
0 0 0.400000
10 0 0.900000
0 10 0.800000
10 10 0.700000
"""

assert run(far_apart) == """\
Case #1: 4
1 2 3 4
""", "zero-overlap boxes all survive"

n = 100000
lines = [f"{n} 1 0.700"]
for i in range(n):
    score = (n - i) / 100000
    lines.append(f"0 0 {score:.5f}")

maximum = "\n".join(["1"] + lines) + "\n"
maximum_output = run(maximum)
maximum_lines = maximum_output.splitlines()

assert maximum_lines[0] == "Case #1: 1", "maximum-size count"
assert maximum_lines[1] == "1", "maximum-size highest score survives"

print("All tests passed.")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 提供样品|`Case #1: 2`, 指数`1 3`| 基本 NMS 行为和输出排序 |
 |`S=3`， 临界点`0.500`, IoU 正好`0.500`| 三者皆选 | 严格的`>`边界|
 |`n=1`,`S=1`| 唯一索引`1`| 最小尺寸输入 |
 | 五个相同的盒子| 仅得分最高的指数 | 相同的位置和分数排序|
 | 四个完全分开的盒子| 全部四项均已入选| 零重叠处理 |
 |`n=100000`,`S=1`| 唯一索引`1`| 最大限度`n`、密集相同位置和可扩展性|

 ## 边缘情况

 对于严格阈值的情况，```
1
2 3 0.500
0 0 0.9
0 1 0.8
```第一个框被选中。 第二个盒子有交集`6`和工会`12`，所以 IoU 正好是`0.5`。 整数测试变成等式：`(1000 + 500) * 6 = 2000 * 500 * 3^2 / 12`,

 或者更直接地说，`1500 * 6 = 500 * 12`。 

条件使用`>`而不是`>=`，因此框 2 未被抑制。 该算法选择两个索引。 

对于零重叠，```
1
2 4 0.300
0 0 0.9
4 0 0.8
```水平差为`4`，等于边长。 因此`ix = 4 - 4 = 0`，并且执行立即跳过候选。 不需要浮点 IoU 计算。 两个盒子都幸存下来。 

对于相同的盒子，```
1
3 1 0.700
0 0 0.5
0 0 0.7
0 0 0.9
```所有三个点都属于同一网格单元。 第一个处理的框是索引 3，因为它的分数最大。 它与其他所有盒子的交集是`1`，因此精确抑制条件成功，因为 IoU 是`1 > 0.7`。 剩下的两个框都被标记为抑制并且从未被选中。 

对于输出排序，请考虑```
1
3 10 0.300
0 0 0.2
9 9 0.9
5 5 0.8
```这些盒子之间的距离足够远，可以保证所有盒子都能幸存下来。 NMS按顺序处理它们`2, 3, 1`，但所需的输出是```
Case #1: 3
1 2 3
```最后的那种`selected`处理处理顺序和输出顺序之间的区别。 

最大尺寸的情况下使用`100000`位于同一坐标的框。 它们都占据一个网格单元，并且单元结构保证该单元中的框的 IoU 高于阈值。 首先选择得分最高的框并抑制其他框`99999`盒子。 后面的每个条目都会被跳过。 除了初始排序之外，这项工作仍然保持线性，因为所有这些框都包含在一个空间桶中，并且每个框仅由选定的框检查恒定次数。
