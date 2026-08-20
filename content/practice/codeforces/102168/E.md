---
title: "CF 102168E - \u041a\u0443\u0431\u0438\u043a\u0438"
description: "我们有一个单位立方体的矩形盒子，尺寸为 x × y × z。 立方体由坐标 (x, y, z) 标识。 三个二维数组描述了三个坐标投影中哪些位置是可见的。"
date: "2026-08-19T07:22:12+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102168
codeforces_index: "E"
codeforces_contest_name: "\u041b\u0438\u0447\u043d\u044b\u0439 \u0447\u0435\u043c\u043f\u0438\u043e\u043d\u0430\u0442 \u0421\u0430\u043c\u0430\u0440\u0441\u043a\u043e\u0433\u043e \u0443\u043d\u0438\u0432\u0435\u0440\u0441\u0438\u0442\u0435\u0442\u0430 \u0441\u0440\u0435\u0434\u0438 \u043d\u043e\u0432\u0438\u0447\u043a\u043e\u0432 2018-2019"
rating: 0
weight: 102168
solve_time_s: 138
verified: true
draft: false
---

[CF 102168E - \u041a\u0443\u0431\u0438\u043a\u0438](https://codeforces.com/problemset/problem/102168/E)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 18s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个单位立方体的矩形盒子，其尺寸为`x × y × z`。 立方体由坐标标识`(x, y, z)`。 三个二维数组描述了三个坐标投影中哪些位置是可见的。 

左边的投影有尺寸`z × y`， 所以`left[z][y]`是`#`恰好当至少有一个立方体固定时`y`和`z`坐标存在。 正面投影有尺寸`z × x`， 所以`front[z][x]`是`#`当一些立方体与那些`x`和`z`坐标存在。 顶部投影有尺寸`y × x`， 所以`top[y][x]`是`#`当一些立方体与那些`x`和`y`坐标存在。 

我们必须重建一个实际的三维图形，其三个投影正是给定的数组。 在所有这些数字中，我们想要一个包含尽可能多的立方体的数字。 

对于特定职位`(x, y, z)`，只有当所有三个对应的投影单元都满足时，立方体才能存在`#`。 如果其中之一是`.`，在那里放置一个立方体会立即使该投影包含不需要的`#`。 

尺寸最多为`100`，所以最多有`100^3 = 1,000,000`可能的立方体位置。 对所有位置的线性传递是很容易实现的。 这也意味着我们应该避免枚举立方体子集或以其他方式探索指数级许多配置的算法。 即使在整个三维空间上进行二次工作也已经是不必要的昂贵。 

主要的边缘情况来自于混淆必要条件和充分条件。 例如，考虑```
2 2 1#..#
.##.
#...
```唯一的`#`左侧投影位于`(y=0,z=0)`，所以一个立方体实现它必须有`y=0`。 唯一的`#`在前投影中需要`x=1`，而唯一的`#`在顶部投影中`y=0`需要`x=0`。 没有一个立方体可以满足所有这三个要求，所以正确答案是`NO`。 一个粗心的解决方案，仅仅检查每个投影是否包含一些`#`会错误地接受它。 

另一个边缘情况是投影单元`#`但没有兼容的立方体，即使可以放置几个其他立方体。 例如，```
2 2 1##..
.#..
#...
```左边的投影需要两者`y=0`和`y=1`包含一个立方体。 前投影仅允许`x=1`，而顶部投影仅允许`x=0`在`y=0`。 这`y=0`左边的单元格无法实现，所以答案是`NO`。 简单地填充两个投影允许的每个位置的结构可能会默默地创建错误的第三个投影。 

在相反的极端，当所有三个投影完全由`#`, 每一个`x*y*z`职位可以填补。 那么答案就是完全装满的盒子，它达到了可能的最大立方体数量。 

## 方法

 最直接的暴力方法是考虑每一个可能的三维图形并检查其投影。 有`x*y*z`可能的立方体位置，因此不同图形的数量是`2^(x*y*z)`。 在最大的情况下，这是`2^1,000,000`可能的配置，远远超出了可以处理的任何内容。 

一种更有用的简单方法是检查每个可能的立方体并确定它是否与三个投影兼容。 这已经表明了关键的观察结果。 对于一个立方体`(x, y, z)`，它的存在被允许恰好在```
left[z][y] = '#'front[z][x] = '#'top[y][x] = '#'
```假设放置了所有此类允许的立方体。 该结构不能引入`#`进入任何最初的投影单元`.`，因为每个放置的立方体都被明确要求与所有三个投影一致。 

剩下的问题是是否每个原件`#`实际上由至少一个放置的立方体表示。 我们可以在同一次扫描中回答这个问题。 每当一个位置满足所有三个条件时，我们就将其三个投影单元标记为已覆盖。 全部处理完后`x*y*z`职位，每个`#`在每个投影中都必须被覆盖。 如果有一些`#`如果仍然未被覆盖，则不存在有效的图形，因为能够覆盖该投影单元的每个立方体也必须满足其他两个投影。 

同样的观察也证明了极大性。 任何有效解决方案中的每个立方体都必须属于与所有三个投影兼容的位置集。 我们的建筑包含每一个这样的位置。 因此，没有其他有效图形可以包含更多立方体。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力破解数字 |`O(2^(xyz))`或者更糟| 指数| 太慢了 |
 | 检查每个立方体并覆盖投影|`O(xyz)`|`O(xy + xz + yz)`除了输出| 已接受 |

 ## 算法演练

 1. 读取三个投影数组。 忽略空分隔线，因为实际投影行仅包含`#`和`.`。 
2. 分配三个与输入投影形状相同的布尔覆盖数组。`covered_left[z][y]`意味着我们已经找到了一个有效的立方体，其投影覆盖了该左视图单元。 另外两个数组的含义类似。 
3. 迭代每个可能的立方体位置`(z, y, x)`。 一个立方体恰好是一个候选者`left[z][y]`,`front[z][x]`， 和`top[y][x]`都是`#`。 
4. 对于每个候选立方体，将其三个投影单元标记为被覆盖。 候选本身也是最终答案的一部分，因为添加它不会损害任何投影。 
5. 扫描后，检查每个`#`在每个投影中。 如果任何此类单元格未被覆盖，请打印`NO`。 没有替代的放置可以修复它，因为覆盖该单元的每个可能的立方体都已经被至少一个其他投影测试和拒绝。 
6.如果全部`#`单元格被覆盖，打印`YES`。 使用相同的兼容性条件再次生成每个输出单元。 一个位置是`#`恰好当所有三个相应的投影单元都为`#`; 否则就是`.`。 
7. 逐层打印`z`顺序，连续层之间有一个空行。 这与所需的图层格式相匹配。 

### 为什么它有效

 考虑集合`C`其三个投影单元为的所有立方体位置`#`。 每个有效图形只能包含来自以下位置的立方体`C`，因为外面有一个立方体`C`会创建一个`#`位于应该是空的投影位置。 我们的建筑包含了每个立方体`C`，因此它至少包含与任何有效数字一样多的立方体。 

当每个输入时，该结构都会准确地产生正确的投影`#`属于至少一个立方体`C`。 覆盖阵列正是测试了这种情况。 如果每一个`#`被覆盖，每个需要的投影单元都被生产出来，同时没有禁止`.`可以产生，因为所有放置的立方体都属于`C`。 如果有一些`#`没有被覆盖，不存在有效的图形，因为没有兼容的立方体能够生成它。 这证明了可行性和极大性。 

## Python 解决方案```python
Pythonimport sysinput = sys.stdin.readline

def solve():    x, y, z = map(int, input().split())
    # Empty lines are separators between projections.    lines = [line.strip() for line in sys.stdin if line.strip()]
    pos = 0
    left = lines[pos:pos + z]    pos += z
    front = lines[pos:pos + z]    pos += z
    top = lines[pos:pos + y]
    covered_left = [[False] * y for _ in range(z)]    covered_front = [[False] * x for _ in range(z)]    covered_top = [[False] * x for _ in range(y)]
    # Find every cube that is compatible with all three projections.    for zz in range(z):        for yy in range(y):            if left[zz][yy] != '#':                continue
            for xx in range(x):                if front[zz][xx] != '#':                    continue                if top[yy][xx] != '#':                    continue
                covered_left[zz][yy] = True                covered_front[zz][xx] = True                covered_top[yy][xx] = True
    # Every '#' in every projection must be represented.    for zz in range(z):        for yy in range(y):            if left[zz][yy] == '#' and not covered_left[zz][yy]:                print("NO")                return
    for zz in range(z):        for xx in range(x):            if front[zz][xx] == '#' and not covered_front[zz][xx]:                print("NO")                return
    for yy in range(y):        for xx in range(x):            if top[yy][xx] == '#' and not covered_top[yy][xx]:                print("NO")                return
    print("YES")
    # Every compatible cube is present in the maximum construction.    for zz in range(z):        for yy in range(y):            row = []            for xx in range(x):                if (                    left[zz][yy] == '#'                    and front[zz][xx] == '#'                    and top[yy][xx] == '#'                ):                    row.append('#')                else:                    row.append('.')            print(''.join(row))
        if zz + 1 < z:            print()

if __name__ == "__main__":    solve()
```实现的第一部分读取维度之后的所有非空行。 这很方便，因为输入用空行明确分隔三个投影，但这些分隔符不携带任何信息。 

三个覆盖数组只存储投影信息，而不是整个三维图形。 它们的总大小是`xy + xz + yz`，这比可能的小得多`xyz`立方体位置并且已经足以确定每个请求的投影单元是否已被实现。 

嵌套循环直接实现中心条件。 索引被故意写成`zz`,`yy`， 和`xx`因此它们与三个投影的关系仍然可见。 左投影使用`(zz, yy)`，正投影使用`(zz, xx)`，顶部投影使用`(yy, xx)`。 

无需存储构造的图形。 确定可行性后，可以在打印时再次评估相同的三个条件。 这使得实现简单并避免分配另一个百万元素的三维结构。 

三个投影的覆盖率检查是分开的，因为其中任何一个的失败都会导致整个重建变得不可能。 Python中不存在整数溢出问题，最大的循环只包含一百万次迭代。 

## 工作示例

 ### 示例 1

 对于第一个样本，尺寸为`x=4`,`y=3`,`z=2`。 第一层具有以下与投影兼容的行：```
#####.#####.
```第二层是```
####....###.
```该算法达到每个`#`在通过至少一个兼容立方体的投影中。 

|`z`|`y`|`x`| 左| 前| 顶部 | 立方体|
 | ---| ---| ---| ---| ---| ---| ---|
 | 0 | 0 | 0 | ＃| ＃| ＃| ＃|
 | 0 | 0 | 1 | ＃| ＃| ＃| ＃|
 | 0 | 0 | 2 | ＃| ＃| ＃| ＃|
 | 0 | 0 | 3 | ＃| ＃| ＃| ＃|
 | 0 | 1 | 0 | ＃| ＃| ＃| ＃|
 | 0 | 1 | 1 | ＃| 。 | ＃| 。 |
 | 0 | 1 | 2 | ＃| ＃| ＃| ＃|
 | 0 | 1 | 3 | ＃| ＃| ＃| ＃|
 | 0 | 2 | 0 | ＃| ＃| ＃| ＃|
 | 0 | 2 | 1 | ＃| ＃| ＃| ＃|
 | 0 | 2 | 2 | ＃| ＃| ＃| ＃|
 | 0 | 2 | 3 | ＃| ＃| 。 | 。 |

 执行相同的测试`z=1`。 每个所需的投影单元都被覆盖，所以答案是`YES`。 填充每个兼容位置会产生最大可能的数字。 

### 示例 2

 对于一个全`#` `2 × 2 × 2`例如，每个立方体都与每个投影单元兼容。 

|`z`| 候选人职位| 覆盖左侧细胞| 覆盖的前部电池 | 覆盖顶部电池|
 | ---| ---| ---| ---| ---|
 | 0 | 4 | 全部 2 | 全部 2 | 所有 4 |
 | 1 | 4 | 全部 2 | 全部 2 | 所有 4 |

 有八个兼容的立方体，因此所有八个都已放置。 输出由两层组成，每层包含```
####
```该示例特别清楚地演示了极大性属性。 由于没有投影包含`.`，没有理由将任何兼容的立方体留空。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O(xyz)`| 每个可能的立方体位置都会检查一次，然后`O(xy + xz + yz)`投影检查和输出。 |
 | 空间|`O(xy + xz + yz)`| 存储输入投影和三个覆盖数组； 输出时直接生成三维图形。 |

 和`x,y,z <= 100`，主循环最多执行一百万个立方体检查。 生成的输出本身可以包含大约一百万个字符，因此运行时间自然与程序可能需要打印的数据量成正比。 

## 测试用例

 由于有效的重建不一定是唯一的，因此测试工具不应比较任意的`YES`逐个字符地输出。 下面的助手根据三个投影验证返回的图形，并检查该图形是否具有最大数量的立方体。```python
Python# helper: run solution on input string, return output stringimport sysimport io

def solve():    x, y, z = map(int, input().split())
    lines = [line.strip() for line in sys.stdin if line.strip()]    pos = 0
    left = lines[pos:pos + z]    pos += z
    front = lines[pos:pos + z]    pos += z
    top = lines[pos:pos + y]
    covered_left = [[False] * y for _ in range(z)]    covered_front = [[False] * x for _ in range(z)]    covered_top = [[False] * x for _ in range(y)]
    for zz in range(z):        for yy in range(y):            if left[zz][yy] != '#':                continue            for xx in range(x):                if front[zz][xx] == '#' and top[yy][xx] == '#':                    covered_left[zz][yy] = True                    covered_front[zz][xx] = True                    covered_top[yy][xx] = True
    for zz in range(z):        for yy in range(y):            if left[zz][yy] == '#' and not covered_left[zz][yy]:                print("NO")                return
    for zz in range(z):        for xx in range(x):            if front[zz][xx] == '#' and not covered_front[zz][xx]:                print("NO")                return
    for yy in range(y):        for xx in range(x):            if top[yy][xx] == '#' and not covered_top[yy][xx]:                print("NO")                return
    print("YES")
    for zz in range(z):        for yy in range(y):            print(''.join(                '#'                if left[zz][yy] == '#'                and front[zz][xx] == '#'                and top[yy][xx] == '#'                else '.'                for xx in range(x)            ))        if zz + 1 < z:            print()

def run(inp: str) -> str:    global input
    old_stdin = sys.stdin    old_stdout = sys.stdout    old_input = input
    sys.stdin = io.StringIO(inp)    sys.stdout = io.StringIO()    input = sys.stdin.readline
    try:        solve()        return sys.stdout.getvalue()    finally:        sys.stdin = old_stdin        sys.stdout = old_stdout        input = old_input

def parse_result(inp: str, out: str):    data = [line.strip() for line in inp.splitlines() if line.strip()]    x, y, z = map(int, data[0].split())
    p = 1    left = data[p:p + z]    p += z    front = data[p:p + z]    p += z    top = data[p:p + y]
    out_lines = out.splitlines()    assert out_lines, "empty output"
    if out_lines[0] == "NO":        return False, None, (left, front, top, x, y, z)
    assert out_lines[0] == "YES"
    figure = []    p = 1
    for zz in range(z):        layer = []        for yy in range(y):            row = out_lines[p]            p += 1            assert len(row) == x            assert all(c in ".#" for c in row)            layer.append(row)        figure.append(layer)
        if zz + 1 < z:            assert out_lines[p] == ""            p += 1
    return True, figure, (left, front, top, x, y, z)

def validate(inp: str, out: str) -> bool:    ok, figure, info = parse_result(inp, out)    left, front, top, x, y, z = info
    expected_exists = True
    for zz in range(z):        for yy in range(y):            if left[zz][yy] == '#':                if not any(                    figure[zz][yy][xx] == '#'                    for xx in range(x)                ):                    expected_exists = False
    for zz in range(z):        for xx in range(x):            if front[zz][xx] == '#':                if not any(                    figure[zz][yy][xx] == '#'                    for yy in range(y)                ):                    expected_exists = False
    for yy in range(y):        for xx in range(x):            if top[yy][xx] == '#':                if not any(                    figure[zz][yy][xx] == '#'                    for zz in range(z)                ):                    expected_exists = False
    if not ok:        return not expected_exists
    # The construction must contain exactly every position compatible    # with all three projections.    for zz in range(z):        for yy in range(y):            for xx in range(x):                allowed = (                    left[zz][yy] == '#'                    and front[zz][xx] == '#'                    and top[yy][xx] == '#'                )                assert (figure[zz][yy][xx] == '#') == allowed
    return expected_exists

# Provided Sample 1.sample1 = """\4 3 2####.##############.#####."""
out = run(sample1)assert out == """\YES#####.#####.####....###.""", "sample 1"

# Provided NO sample, reconstructed from the three projection groups# shown in the statement.sample_no = """\3 3 3#...#...#.#...##....##...#."""
assert run(sample_no).strip() == "NO", "provided NO sample"

# Minimum-size valid instance.minimum = """\1 1 1#
#
#"""
assert run(minimum) == """\YES#""", "minimum valid instance"

# Minimum-size impossible instance. At least one projection requests# a cube, but the three requests cannot refer to the same cube.minimum_no = """\1 1 1.
#
#"""
assert run(minimum_no).strip() == "NO", "minimum impossible instance"

# Boundary case where every projection is full.all_full = """\2 2 2####
####
####"""
assert validate(all_full, run(all_full)), "all projections full"

# A compatibility conflict: every projection has '#', but no cube can# satisfy all three projections simultaneously.conflict = """\2 2 1#...
.#..
#..."""
assert run(conflict).strip() == "NO", "incompatible projections"

# A larger boundary case with one compatible cube and many empty cells.single_cube = """\3 3 2#........
.#.......
.#......."""
assert validate(single_cube, run(single_cube)), "single compatible cube"
```第一个断言比较完整的输出，因为第一个样本的确定性构造在此实现下具有唯一的结果。 其余的阳性测试使用`validate`，因为建设性问题通常允许多个不同的有效输出。 

全满测试对于检查每个循环的上限特别有用。 冲突测试捕获了最常见的逻辑错误，仅仅因为每个投影都包含所请求的内容而接受实例`#`细胞独立。 单立方体测试测试盒子内的非零坐标，并检查空的投影单元是否强制相应的三维位置保持为空。 

| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 首次提供样品 | 精确的`YES`建筑| 正常重建和最大填充 |
 | 假如`NO`样品|`NO`| 不兼容的投影约束 |
 |`1 × 1 × 1`， 全部`#`| 一个立方体 | 最小尺寸 |
 |`1 × 1 × 1`, 一个投影`.`|`NO`| 最小不可能实例 |
 |`2 × 2 × 2`， 全部`#`| 整盒 8 块 | 完整的边界和最大的建设|
 | 冲突`2 × 2 × 1`预测|`NO`| 检测不兼容`#`细胞|
 | 疏`3 × 3 × 2`实例|`YES`，一个兼容的立方体| 坐标映射和空单元格 |

 ## 边缘情况

 对于最小有效输入，```
1 1 1#
#
#
```恰好存在一个可能的立方体。 所有三个投影都需要它，所以三重`(0,0,0)`满足三个条件。 所有投影单元都被标记为覆盖，输出为```
YES#
```该算法不需要对维度进行任何特殊处理`1`; 普通循环自然只执行一次。 

对于最小的不可能输入，```
1 1 1.
#
#
```唯一可能的立方体被立即拒绝，因为左投影是`.`。 两人`#`如果没有该立方体，其他投影中的单元就无法实现，因此覆盖检查会发现一个未覆盖的单元`#`并返回`NO`。 

冲突案例```
2 2 1#...
.#..
#...
```显示了为什么必须一起检查所有三个投影。 左边的投影要求`y=0`，前投影要求`x=1`，而顶部投影要求`x=0`在`y=0`。 在唯一的高度层期间，没有`(x,y)`对满足所有三个条件。 最后`covered_left[0][0]`保持 false 并且算法拒绝该实例。 

对于一个完全充满的`2 × 2 × 2`盒子，```
2 2 2####
####
####
```的每一个组合`x`,`y`， 和`z`满足所有三个条件。 扫描覆盖每个投影单元，输出包含所有八个立方体。 由于每个可能的立方体都是兼容的，因此有效的解决方案不能包含超过八个立方体，因此该构造是最佳的。 

稀疏情况也可以在没有特殊情况的情况下进行处理。 投影单元标记为`.`消除映射到其上的每个三维位置。 由于最终图形恰好是三个提升投影的交集，因此一维边界和内部空白区域的处理方式相同。 这是整个结构背后的中心不变量。
